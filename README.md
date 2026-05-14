# The Intelligent Bistro

A polished mobile-first restaurant ordering app where an AI assistant manages your cart through natural conversation. Built as an internship take-home project.

---

## What it does

- Browse a full restaurant menu with category filtering
- Add, remove, and update cart items manually
- Chat with an AI assistant to update your cart naturally:
  - *"Add two spicy chicken sandwiches and a sparkling water"*
  - *"Remove the fries"*
  - *"Make the burger quantity 3"*
  - *"What do you recommend?"*
  - *"Clear my cart"*
- Live cart totals with tax calculation
- Graceful fallback if the AI is unavailable

---

## Tech stack

**Frontend**
- React Native + Expo (TypeScript)
- NativeWind (Tailwind CSS for React Native)
- Zustand for cart state

**Backend**
- Node.js + Express (TypeScript)
- Zod for request and AI response validation
- Anthropic SDK (Claude) or OpenAI SDK — whichever key is present
- Local fallback parser for demo use without any API key

---

## Project structure

```
intelligent-bistro/
├── frontend/
│   ├── App.tsx                 # Main screen
│   ├── components/             # UI components
│   │   ├── AssistantPanel.tsx  # AI chat UI
│   │   ├── CartDrawer.tsx      # Cart list + totals
│   │   ├── CartItemRow.tsx     # Quantity controls
│   │   ├── CategoryPill.tsx    # Filter pills
│   │   ├── MenuCard.tsx        # Menu item card
│   │   ├── PriceRow.tsx        # Label + price line
│   │   └── SuggestedPrompt.tsx # Quick-send chip
│   ├── constants/theme.ts      # Colors + category labels
│   ├── services/api.ts         # Fetch wrappers
│   ├── store/cartStore.ts      # Zustand cart store
│   └── types/                  # Shared TypeScript types
└── backend/
    └── src/
        ├── data/menu.json      # 8 menu items
        ├── routes/             # Express route handlers
        ├── services/
        │   ├── aiParser.ts     # Anthropic / OpenAI + Zod validation
        │   ├── cartService.ts  # Cart action application
        │   └── fallbackParser.ts # Demo parser (no API key needed)
        ├── utils/              # money.ts, validateCart.ts
        └── server.ts
```

---

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli` (or use `npx expo`)
- An Anthropic or OpenAI API key (optional — fallback parser works without one)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Add your API key to .env if you have one
npm run dev
```

The server starts on `http://localhost:4000`.

### 2. Frontend

```bash
cd frontend
npm install
npx expo start
```

Press `i` for iOS Simulator, `a` for Android, or `w` for web.

> **Physical device:** Update `BASE_URL` in `frontend/services/api.ts` to your machine's local IP (e.g. `http://192.168.1.42:4000`).

---

## Environment variables

`backend/.env`:

```
PORT=4000
ANTHROPIC_API_KEY=sk-ant-...   # Preferred
OPENAI_API_KEY=sk-...          # Used if Anthropic key is absent
AI_PROVIDER=anthropic          # or "openai"
```

If neither key is set, the fallback parser handles these demo phrases:
- `add spicy chicken sandwich`
- `add two spicy chicken sandwiches`
- `add fries`
- `add water`
- `remove fries`
- `clear cart`
- `make burger quantity 3`

---

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/menu` | Fetch all menu items |
| `POST` | `/chat` | Send a message + current cart, receive updated cart |

---

## Example AI prompts to test

```
Add two spicy chicken sandwiches and a large water
Remove the fries
Make the burger quantity 3
Add a Caesar salad but no croutons
What do you recommend?
Clear my cart
Add truffle fries, medium size
```

---

## AI usage notes

The AI is used strictly for natural language → structured JSON parsing. The system prompt tells the model:
- Only reference menu IDs that actually exist
- Return a fixed JSON schema (validated with Zod before use)
- Preserve cart items the user didn't mention
- Ask for clarification if ambiguous

Cart math (subtotals, tax, totals) is always computed on the backend, never trusted from AI output.

I used Claude Code during development for initial boilerplate, component structure, and prompt engineering. Roughly 40% of the code was written manually after reviewing and adjusting what was generated.

---

## Known tradeoffs / future improvements

- **No auth** — this is a demo, so there's no user session or order history
- **No persistence** — cart resets on app reload; a simple SQLite store would fix this
- **Single screen** — a real app would have separate menu, cart, and checkout screens
- **Modifier UI** — size and spice level can be set via AI, but the menu card UI doesn't show a picker yet
- **No optimistic UI on AI actions** — the cart only updates after the server responds; adding an optimistic update would feel snappier
- **Fallback parser is intentionally limited** — it covers the demo script; a real implementation would use the AI exclusively

This is a polished take-home prototype, not production-ready software.
