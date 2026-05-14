import { Router } from "express";
import menuData from "../data/menu.json";
import { MenuItem } from "../types/menu";

const router = Router();
const menu = menuData as MenuItem[];

router.get("/", (_req, res) => {
  res.json({ menu });
});

export default router;
