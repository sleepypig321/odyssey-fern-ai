# Fern: Wix installation handoff 🌿

**Status:** Fern is independently hosted on Cloudflare Workers. Connecting it to OdysseyHerbals.com requires access to Chad's Wix dashboard. Do not redeploy the code or make another Wix website.

## Paste this once in the existing Odyssey Wix dashboard

1. Open **Settings → Custom Code** in the Odyssey site's dashboard.
2. Choose **+ Add Custom Code**.
3. Name the code **Fern — Odyssey Botanical Guide**.
4. Paste this exact snippet:

```html
<script src="https://odyssey-fern-ai.fern-croxton.workers.dev/embed.js" defer></script>
```

5. Under **Add Code to Pages**, choose **All pages**, load **Once per visit** if prompted.
6. Under **Place Code in**, choose **Body — end**.
7. Select **Apply**. Publish if Wix requests it.
8. Open the public OdysseyHerbals.com site in a new private/incognito browser window. Confirm there is one compact floating **🌿 Ask Fern** button at the bottom-right. Click it, and send:
   - "What does mitragynine do?"
   - "Can you explain CBD versus THC?"
   - "I take prescription medication. Is kratom safe with it?"
9. Verify she gives relevant, warm, concise educational answers. Close **Ask Fern** and reopen it: the conversation should still be there. Refresh the Wix page and navigate to another Odyssey page in the **same tab**: the conversation should be restored. Click **New chat** to clear it. Confirm phone and desktop layouts do not cover key page controls.

Wix instructions: https://support.wix.com/en/article/adding-a-custom-tracking-code-to-your-site

**Conversation persistence:** The customer-facing build/version label is hidden. The Wix embed stores recent messages temporarily in the browser tab (and asks the child chat to do the same where allowed). Chats survive closing/reopening the bubble, refreshing, and navigating within the same site tab in ordinary browser settings. Closing the tab, clearing website data or using browser modes that restrict storage may clear conversation history. This is not a permanent account-based chat archive.

## Ownership and operating safeguards

- Fern's hosting currently belongs to the developer's Cloudflare account, **not** Odyssey's Wix or Chad's account.
- Workers AI Free usage is limited. Free usage cannot be promised forever; monitor Cloudflare billing and AI usage, and make a plan with Chad for future usage and payment before traffic grows.
- Fern's product catalog is provisional, not connected to live Wix inventory. Odyssey should review product labels, testing and product compliance before public promotion.
- Fern is for general botanical education, not individualized medical, kratom dosage, or controlled-product purchasing advice.
- The Wix snippet exposes **no** secret. Never paste Cloudflare API tokens into Wix custom code.
- Later, if an authorized person grants access to Odyssey's Wix dashboard, update the integration there. No domain purchase is required for Fern's standalone Worker.

**Cloudflare chatbot URL:** https://odyssey-fern-ai.fern-croxton.workers.dev

**GitHub source:** https://github.com/sleepypig321/odyssey-fern-ai
