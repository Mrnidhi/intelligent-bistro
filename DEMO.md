# Demo Walkthrough (5-minute Loom outline)

This is a rough script for a 5-minute screen recording.

---

## 0:00 – App overview

Open the app in Expo Go or the iOS Simulator.

- Point out the header: restaurant name, tagline, "AI Online" status pill.
- Scroll through the menu cards briefly — name, price, description, tags.
- Show the category pills — tap "Drinks" to filter, then tap "All" to reset.

---

## 0:45 – Manual cart interaction

- Tap **Add** on the Bistro Burger.
- Scroll down to the cart — the item appears with quantity 1 and the correct line total.
- Tap **+** to increase quantity to 2 — total updates.
- Tap **−** to decrease back to 1.
- Tap **Remove** — cart goes back to empty state.

---

## 1:30 – AI: Add multiple items

In the AI Assistant, type (or tap the suggestion chip):

> "Add two spicy chicken sandwiches and a large water"

- Watch the assistant respond with a friendly confirmation.
- Show the cart updating instantly: two spicy chicken sandwiches + water.
- Point out that the subtotal, tax, and total update correctly.

---

## 2:30 – AI: Remove an item

> "Remove the fries"

*(If you don't have fries in your cart: "Add truffle fries" first, then remove.)*

- Cart updates, assistant confirms.

---

## 3:00 – AI: Update quantity

> "Make the burger quantity 3"

*(Add a Bistro Burger first if needed.)*

- Show the line total for the burger changing.
- Mention that the backend validates the item ID before applying it, so the AI can't invent items.

---

## 3:45 – Show cart totals

Scroll to the cart summary:

- Subtotal
- Tax (9%)
- Total

Point out that math is done on the backend, not by the AI.

---

## 4:15 – Brief code tour

Switch to your editor:

- `backend/src/services/aiParser.ts` — how the system prompt works, Zod validation.
- `backend/src/services/fallbackParser.ts` — simple regex fallback for demos.
- `frontend/store/cartStore.ts` — Zustand store with `replaceCart` called after AI response.
- `frontend/components/AssistantPanel.tsx` — chat UI and API call.

---

## 4:45 – Honest AI tool disclosure

Mention briefly:

> "I used Claude Code to help scaffold the initial project structure and draft the AI system prompt. I reviewed and revised all the code manually — especially the Zod validation, cart logic, and UI polish. About 40% was written or significantly edited by hand."

---

## 5:00 – Wrap up

- Mention the README has setup instructions, known tradeoffs, and example prompts.
- The fallback parser means it works without an API key for demos.
