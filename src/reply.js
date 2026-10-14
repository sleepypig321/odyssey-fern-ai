/**
 * Keep chatbot replies readable on small screens and never display
 * a trailing half-sentence when the model reaches its token budget.
 * This is a formatting guard, not a substitute for the model's own
 * brevity instruction. Explicit requests for extra detail get more room.
 */
export function finishReply(raw, maxWords = 150) {
  const text = String(raw || "").trim();
  if (!text) return "";
  const words = text.split(/\s+/);
  const overLimit = words.length > maxWords;
  const candidate = overLimit ? words.slice(0, maxWords).join(" ") : text;
  // A reply is complete when the final sentence ends cleanly.
  if (!overLimit && /[.!?]["'”’)]?$/.test(candidate)) return candidate;

  // Trim a trailing partial sentence or unfinished question.
  // Require a word boundary so punctuation in URLs/numbers is unlikely to count.
  const boundaries = [...candidate.matchAll(/[.!?](?=\s|$)/g)];
  const final = boundaries.at(-1);
  if (final && final.index >= 18) {
    return candidate.slice(0, final.index + 1).trim();
  }
  // No sentence boundary to safely preserve: don't return arbitrary fragments.
  return "I'd like to give you a clear answer, but part of my response was cut short. Could you ask that once more?";
}
