import { z } from "zod";
import { CartItem } from "../types/cart";
import { ChatResponse } from "../types/chat";
import { MenuItem } from "../types/menu";
import { applyActions, buildCartSummary } from "./cartService";
import { fallbackParse } from "./fallbackParser";

// ── Zod schemas ─────────────────────────────────────────────────────────────

const ModifiersSchema = z
  .object({
    size: z.enum(["small", "medium", "large"]).nullable().optional(),
    spiceLevel: z.enum(["mild", "medium", "spicy"]).nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .optional();

const CartActionSchema = z.object({
  type: z.enum(["add", "remove", "update_quantity", "clear_cart"]),
  itemId: z.string(),
  quantity: z.number().int().positive().optional(),
  modifiers: ModifiersSchema,
});

const AIResponseSchema = z.object({
  reply: z.string(),
  intent: z.enum(["update_cart", "clarify", "recommendation", "menu_question", "clear_cart", "no_action"]),
  actions: z.array(CartActionSchema),
});

type AIResponse = z.infer<typeof AIResponseSchema>;

// ── Shared prompt builder ────────────────────────────────────────────────────

function buildSystemPrompt(menu: MenuItem[]): string {
  return `You are a friendly restaurant ordering assistant for The Intelligent Bistro.
Your job is to help customers manage their cart through natural conversation.

## Menu
${JSON.stringify(menu, null, 2)}

## Rules
- Only use item IDs that exist in the menu above. Never invent items or prices.
- Map natural names to menu IDs (e.g. "fries" → "truffle-fries", "water" → "still-water" unless "sparkling" is specified).
- Infer quantity from context: "a water" means quantity 1, "two sandwiches" means 2.
- Preserve existing cart items unless the user asks to remove or clear them.
- If the request is ambiguous, set intent to "clarify" and ask a short follow-up question.
- For greetings or small talk, set intent to "no_action" and reply warmly.
- Never expose prices or IDs in your reply text — keep it conversational.

## Response format
Return ONLY valid JSON matching this exact shape (no markdown, no extra text):
{
  "reply": "<friendly confirmation or question>",
  "intent": "<update_cart | clarify | recommendation | menu_question | clear_cart | no_action>",
  "actions": [
    {
      "type": "<add | remove | update_quantity | clear_cart>",
      "itemId": "<menu item id>",
      "quantity": <number, required for add and update_quantity>,
      "modifiers": {
        "size": <"small"|"medium"|"large"|null>,
        "spiceLevel": <"mild"|"medium"|"spicy"|null>,
        "notes": <string|null>
      }
    }
  ]
}`;
}

// ── Provider-specific callers ────────────────────────────────────────────────

async function callAnthropic(
  message: string,
  currentCart: CartItem[],
  menu: MenuItem[]
): Promise<AIResponse> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userMessage = `Current cart: ${JSON.stringify(currentCart)}

User message: ${message}`;

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    system: buildSystemPrompt(menu),
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return AIResponseSchema.parse(JSON.parse(text));
}

async function callOpenAI(
  message: string,
  currentCart: CartItem[],
  menu: MenuItem[]
): Promise<AIResponse> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const userMessage = `Current cart: ${JSON.stringify(currentCart)}

User message: ${message}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt(menu) },
      { role: "user", content: userMessage },
    ],
  });

  const text = response.choices[0]?.message?.content ?? "";
  return AIResponseSchema.parse(JSON.parse(text));
}

// ── Public entry point ───────────────────────────────────────────────────────

export async function parseWithAI(
  message: string,
  currentCart: CartItem[],
  menu: MenuItem[]
): Promise<ChatResponse> {
  const provider = process.env.AI_PROVIDER;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  let aiResponse: AIResponse | null = null;

  try {
    if ((provider === "anthropic" || !provider) && hasAnthropic) {
      aiResponse = await callAnthropic(message, currentCart, menu);
    } else if ((provider === "openai" || !provider) && hasOpenAI) {
      aiResponse = await callOpenAI(message, currentCart, menu);
    }
  } catch (err) {
    // AI call or Zod validation failed — fall through to fallback
    console.error("[aiParser] AI call failed:", err instanceof Error ? err.message : err);
  }

  if (!aiResponse) {
    return fallbackParse(message, currentCart, menu);
  }

  const updatedCart = applyActions(currentCart, aiResponse.actions, menu);
  const cartSummary = buildCartSummary(updatedCart);

  return {
    reply: aiResponse.reply,
    intent: aiResponse.intent,
    actions: aiResponse.actions,
    updatedCart,
    cartSummary,
  };
}
