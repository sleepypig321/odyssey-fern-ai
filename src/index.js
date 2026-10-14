import { HTML } from "./ui.js";
import { EMBED_SCRIPT } from "./embed.js";
import { publicCatalog } from "./catalog.js";
import { buildSystemPrompt, cleanHistory, safetyOverride } from "./policy.js";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {status, headers: {...JSON_HEADERS, ...headers}});

function isSameOriginBrowserPost(request) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) return false;
  const site = request.headers.get("Sec-Fetch-Site");
  return !site || site === "same-origin" || site === "none";
}
function matchesToken(actual, expected) {
  if (!expected || !actual) return false;
  // Avoid first-character short-circuit comparisons.
  const a = new TextEncoder().encode(actual);
  const b = new TextEncoder().encode(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i=0;i<a.length;i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
async function answer(request, env) {
  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > 16000) return json({error:"Message too large."}, 413);
  if (!request.headers.get("Content-Type")?.toLowerCase().includes("application/json")) {
    return json({error:"Send application/json."},415);
  }
  const incoming = await request.text();
  if (incoming.length > 16000) return json({error:"Message too large."}, 413);
  let data;
  try {data = JSON.parse(incoming);} catch {return json({error:"Invalid JSON."},400)}
  const message = typeof data?.message === "string" ? data.message.trim() : "";
  if (!message || message.length > 1800) return json({error:"Message must be 1–1800 characters."},400);

  // High-stakes risk responses do not rely entirely on generative text.
  const intervention = safetyOverride(message);
  if (intervention) return json({reply:intervention, safetyNotice:true});
  if (!env.AI) return json({error:"Fern's AI is not configured yet."},503);
  const history = cleanHistory(data.history);
  const system = buildSystemPrompt();
  const messages = [{role:"system",content:system}, ...history, {role:"user",content:message}];
  try {
    const result = await env.AI.run(
      env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct-fp8",
      {messages, max_tokens:650, temperature:0.5}
    );
    const reply = typeof result?.response === "string" ? result.response.trim() : "";
    if (!reply) return json({error:"Fern couldn't complete her response. Please try again."},502);
    return json({reply});
  } catch (error) {
    console.error("Fern model error", String(error));
    return json({error:"Fern is temporarily unavailable. Please try again shortly."},503);
  }
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "GET") {
      if (path === "/" || path === "/index.html") {
        return new Response(HTML,{headers:{"Content-Type":"text/html; charset=utf-8","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","Cache-Control":"no-store"}});
      }
      if (path === "/embed.js") {
        return new Response(EMBED_SCRIPT,{headers:{"Content-Type":"application/javascript; charset=utf-8","X-Content-Type-Options":"nosniff","Cache-Control":"public, max-age=600"}});
      }
      if (path === "/api/health") return json({service:"Fern", ready:!!env.AI, catalogVerified:false, peptidesEnabled:false, externalApiEnabled:!!env.FERN_API_KEY});
      if (path === "/api/catalog") return json(publicCatalog());
      return json({error:"Not found."},404);
    }
    if (request.method !== "POST") return json({error:"Method not allowed."},405);
    if (path !== "/api/chat" && path !== "/api/v1/chat") return json({error:"Not found."},404);
    if (path === "/api/chat" && !isSameOriginBrowserPost(request)) return json({error:"Cross-site requests aren't permitted; embed Fern using the iframe or widget."},403);
    if (path === "/api/v1/chat") {
      if (!env.FERN_API_KEY) return json({error:"External API not enabled."},503);
      const bearer = request.headers.get("Authorization") || "";
      if (!bearer.startsWith("Bearer ") || !matchesToken(bearer.slice(7),env.FERN_API_KEY)) return json({error:"Unauthorized."},401);
    }
    // Free-tier abuse control: Cloudflare rate-limit binding.
    if (env.FERN_RATE) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const scope = path === "/api/chat" ? "public" : "api";
      const {success} = await env.FERN_RATE.limit({key:scope+":"+ip});
      if (!success) return json({error:"Fern has received too many messages. Please try again in a minute."},429,{"Retry-After":"60"});
    }
    return answer(request,env);
  }
};
