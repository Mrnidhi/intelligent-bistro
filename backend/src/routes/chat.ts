import { Router, Request, Response } from "express";
import { z } from "zod";
import menuData from "../data/menu.json";
import { MenuItem } from "../types/menu";
import { parseWithAI } from "../services/aiParser";

const router = Router();
const menu = menuData as MenuItem[];

const CartItemSchema = z.object({
  itemId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  modifiers: z
    .object({
      size: z.enum(["small", "medium", "large"]).nullable().optional(),
      spiceLevel: z.enum(["mild", "medium", "spicy"]).nullable().optional(),
      notes: z.string().nullable().optional(),
    })
    .optional(),
  lineTotal: z.number(),
});

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  currentCart: z.array(CartItemSchema),
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = ChatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
  }

  const { message, currentCart } = parsed.data;

  try {
    const result = await parseWithAI(message, currentCart, menu);
    return res.json(result);
  } catch (err) {
    console.error("[chat route] Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
