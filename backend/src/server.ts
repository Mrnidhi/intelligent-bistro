import "dotenv/config";
import express from "express";
import cors from "cors";
import menuRouter from "./routes/menu";
import chatRouter from "./routes/chat";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/menu", menuRouter);
app.use("/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`Intelligent Bistro API running on http://localhost:${PORT}`);
});
