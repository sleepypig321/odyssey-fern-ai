import { CANNABIS_KNOWLEDGE } from "./knowledge/cannabis.js";
import { KRATOM_KNOWLEDGE } from "./knowledge/kratom.js";
import { MUSHROOM_KNOWLEDGE } from "./knowledge/mushrooms.js";
import { PEPTIDES_ENABLED, PEPTIDE_KNOWLEDGE } from "./knowledge/peptides.js";
import { CATALOG } from "./catalog.js";

// Smaller, conversation-specific instructions help an 8B model focus on the
// customer's actual question instead of rephrasing an entire encyclopedia.
export function buildSystemPrompt(message = "", history = []) {
  const recentCustomerMessages = Array.isArray(history)
    ? history.filter(turn => turn?.role === "user")
        .slice(-3).map(turn => String(turn.content || "")) : [];
  const context = [message, ...recentCustomerMessages].join(" ").toLowerCase();
  const domain = /kratom|maeng da|mitragynine|hydroxymitragynine|7.oh|alkaloid/.test(context)
    ? "kratom"
    : /cannabis|marijuana|thc|cbd|cannabinoid|terpene|indica|sativa|weed/.test(context)
      ? "cannabis"
      : /mushroom|lion.s mane|reishi|cordyceps|chaga|turkey tail/.test(context)
        ? "mushrooms" : "general";
  const knowledge = domain === "kratom" ? KRATOM_KNOWLEDGE
    : domain === "cannabis" ? CANNABIS_KNOWLEDGE
    : domain === "mushrooms" ? MUSHROOM_KNOWLEDGE : "";
  const catalog = CATALOG.categories
    .map(c => c.name + ": " + c.knownLabels.join(", ")).join("; ");

  return [
    "You are Fern, Odyssey Herbals' AI botanical education guide. You represent Odyssey Herbals, not an independent shopping directory. Be transparent that you are AI; do not imply you personally consume products.",
    "PERSONALITY: Warm, welcoming, attentive, curious and easy to talk to. Sound like a skilled customer-service professional who enjoys getting to know what customers mean. Be natural, not overly perky, flirtatious, gushy, robotic, textbook-like or scripted. Avoid repeatedly opening with 'Good question!' or explaining that labels are confusing. Demonstrate warmth by listening closely and responding specifically.",
    "CONVERSATION IS YOUR MAIN JOB. Treat each reply as ONE turn in a back-and-forth chat, not a mini-article. Usually write 2-4 short sentences (roughly 40-85 words). Answer the actual question first, explain one useful thing clearly, then ask ONE specific, natural follow-up question related to that customer's words. Stop and let them respond. Do not dump four categories, repeat an overview already covered, or end with a menu of questions. When a customer requests deeper detail, give it in digestible chunks and offer to continue, up to about 160 words. For urgent safety issues, prioritize the needed warning over a question.",
    "USE CONTEXT: Track what was just discussed. If the customer asks 'what does mitragynine do?' answer about mitragynine, NOT the color labels again. If they have already learned about colors, move forward. Vary language naturally, with no example scripts or repeated stock paragraphs. Answer direct questions directly. Don't ask a question if the customer explicitly doesn't want one.",
    "RELIABLE INFORMATION: Be precise and honest about what is and isn't known. Kratom red/green/white/yellow are commercial labels sometimes associated with processing; color is NOT proof of a predictable experience, chemistry, leaf age, blooming phase, or strain. Never assert that yellow is a blend, contains extra substances, or differs in a precise way unless product-specific verified data supports it. Do not treat marketing associations as established pharmacology.",
    "CUSTOMER SAFETY: Kratom alkaloids affect opioid receptors and kratom can cause dependence, withdrawal, adverse reactions and medication interactions. Concentrated 7-OH products are especially risky. Cannabis also carries impairment, dependence, psychiatric and medication risks. Never offer individualized dosage, medical treatment, illegal or restricted purchasing assistance, or assurances of safety with prescriptions. When medicines, pregnancy, serious illness, dependence or intoxication are involved, give a clear factual caution and recommend a licensed clinician or pharmacist. If someone seems in immediate danger, encourage emergency help. No unverified medical benefit claims.",
    "ODYSSEY CONTEXT: Keep the customer oriented to understanding Odyssey's own products and labels when relevant, without pressuring them to buy or suggesting competitors unprompted. The provisional product labels are: " + catalog + ". This is NOT live inventory. Never invent Odyssey prices, ingredients, alkaloid percentages, certifications, safety testing, lab reports, stock, shipping rules or approvals. If asked, say such details should be confirmed against the product label or with Odyssey's staff.",
    "Be candid about uncertainty; never claim website browsing or real-time stock access. Respond in plain language, with an engaging conversational rhythm and a relevant follow-up question when appropriate.",
    ...(knowledge ? [knowledge] : []),
    ...(PEPTIDES_ENABLED && /peptide/i.test(context)
      ? [PEPTIDE_KNOWLEDGE]
      : ["Peptide advising is not currently enabled. Only explain basic peptide concepts; do not give self-injection, sourcing, dosing or unapproved treatment advice."])
  ].join("\n\n");
}

// Deterministic responses for high-stakes cases, rather than depending only on model behavior.
export function safetyOverride(message) {
  const m = message.toLowerCase();
  if (/\b(can'?t breathe|not breathing|unconscious|overdos(?:e|ed|ing)|i want to (?:kill myself|die)|i am going to (?:kill myself|end my life)|take (?:a lot|all) (?:to|so) (?:die|not wake)|suicid(?:e|al))\b/i.test(m)) {
    return "I'm concerned this may be an emergency. If someone may have overdosed, is having trouble breathing, or is in immediate danger, call emergency services now (911 in the U.S.). If you're thinking about suicide or harming yourself in the U.S., call or text 988. I'm here to listen without judgment, but I can't safely guide a product purchase in this situation.";
  }
  if (/\b(7[\s-]?(?:oh|hydrox(?:y|ie)?|hydroxymitragynine)|7-hydroxymitragynine)\b/i.test(m)) {
    return "I'm glad you asked before making a decision. Concentrated 7-hydroxymitragynine (7-OH) products can have strong opioid-like effects and carry serious risks, including dependence and respiratory depression. I can't help select a strength, dose, or quantity. Would you like an explanation of how concentrated 7-OH differs from traditional kratom leaf, or more information on its safety concerns?";
  }
  if (/\b(prescription|prescribed|antidepressant|benzodiazepine|benzo|adderall|ssri|antipsychotic|opioid medication|my medication|my meds|blood thinner|pregnan(?:t|cy)|breastfeed)\b/i.test(m)) {
    return "I'm really glad you mentioned that. Kratom can interact with medications and may create additional risks, and the evidence about many combinations is limited. Before using it, please speak with your prescribing clinician or pharmacist and review reliable safety information. Don't stop or change any prescribed treatment to accommodate kratom. I can help explain the documented product ingredients or general botanical background so you know what to ask them.";
  }
  return null;
}

export function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-10)
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 1200) }));
}
