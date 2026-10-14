# Fern 🌿 — Odyssey Herbals' Botanical Guide

Fern is an independent, question-led educational chatbot for Odyssey Herbals. Its personality is inspired by the owner's customer-service approach: ask one thoughtful question, explain clearly, check understanding, then go deeper if the customer wants.

## What is included
- A standalone, mobile-friendly chatbot hosted on a free Cloudflare Workers URL; no extra domain.
- Workers AI integration using a Cloudflare-hosted model. No OpenAI API key required.
- An embeddable floating chat widget (GET /embed.js), or a simple iframe (GET /).
- A server-to-server authenticated JSON API (POST /api/v1/chat) for future Wix Velo backend integration.
- A separate public same-origin endpoint (POST /api/chat) used only by the embedded interface.
- Safety-first handling for kratom, 7-OH, prescriptions, and urgent danger.
- A *provisional* product catalog awaiting verification against current Odyssey product labels.
- Separate knowledge modules for **kratom, cannabis/THC, and functional mushrooms**. **Peptides** are a disabled optional module that can be enabled later after review.
- Rate limiting and no server-side storage of conversations.

## Deployment (Cloudflare Free)
1. In Cloudflare, open **Workers & Pages** → **Create** → **Import a repository** (or Connect to Git).
2. Select GitHub repository: sleepypig321/Fern-
3. Worker name: odyssey-fern-ai. Production branch: main.
4. Build command: leave blank. Deploy command: npx wrangler deploy
5. AI binding and rate limiter are declared in wrangler.jsonc. Cloudflare Workers AI free usage has a daily allowance; monitor your usage before promoting publicly.
6. To enable the authenticated external API, add a strong secret with: npx wrangler secret put FERN_API_KEY (never put a key in GitHub or website HTML).
7. Open the assigned HTTPS workers.dev address. The /api/health endpoint provides a configuration check but not a live model test.

If the Cloudflare Git integration asks for a build command, use npm install; deploy command stays npx wrangler deploy.

## Wix integration
**Fastest / safer embed:** In Wix Editor add "Embed Site", set Website Address to your complete worker URL, for example https://odyssey-fern-ai.<your-worker-subdomain>.workers.dev. Set the element to a comfortable width and height.

**Floating Fern across pages:** In Wix Custom Code or supported Custom Embed choose Body End and use:
    <script src="https://odyssey-fern-ai.<your-worker-subdomain>.workers.dev/embed.js" defer></script>
Replace the placeholder with the real workers.dev domain. This client script never contains an API secret.

**Wix Velo/backend JSON API:** Store FERN_API_KEY securely in a Wix backend secret and call POST https://<worker>/api/v1/chat from the backend (never expose the secret in frontend JavaScript), using Authorization: Bearer <secret> and JSON {"message":"...","history":[{"role":"user","content":"..."}]}. Response is JSON {"reply":"..."}.

## HTTP routes
- GET / — accessible Fern chat UI.
- GET /embed.js — fixed-position chat launcher for compatible Wix custom code.
- GET /api/health — readiness/config status.
- GET /api/catalog — provisional product categories/labels only.
- POST /api/chat — public same-origin chat, for the built-in widget.
- POST /api/v1/chat — authenticated server-side API. Disabled until FERN_API_KEY is set.

## Edit before public use
Verify every product, label, ingredient, concentration, warning, and availability in src/catalog.js and update it. The Worker deliberately has no access to live Wix inventory or checkout: it must never claim stock, price, or an ingredient concentration without approved data. The color names are commercial labels, not clinically established effect guarantees.

The assistant provides educational information about botanical subjects including cannabis/THC; it does not facilitate marijuana sales, age-restricted transactions, diagnosis, treatment, medication instructions, individualized dosing, or medical advice. It should not claim to know live cannabis laws. Peptides are OFF until reviewed and intentionally enabled. Review applicable age, product, and jurisdiction restrictions and confirm compliance with the business before taking orders.

This starter is for a human-reviewed pilot. Test the safety flows and Cloudflare deployment before embedding on the public site.

## Run and test
    npm install
    npm test
    npm run dev
    npm run deploy

Fern itself has no conversation database. The widget retains conversation turns in this page's memory until refreshed; the chat prompts are processed by Cloudflare Workers AI under Cloudflare's service policies.

## Security / operating notes
- API keys remain server-side; there is no legitimate way to secure a secret inside an HTML widget.
- Browser Origin checks reduce cross-site calls but are not customer authentication. The public chatbot is intentionally anonymous; the Cloudflare Rate Limiting binding helps reduce accidental or automated excess.
- Model instructions alone cannot guarantee medical-safety compliance; test and maintain it.
- The bot does not collect or require a customer's medical history, contact information, or age through chat. Do not enter sensitive personal information.
