import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import habitsRoutes from "./routes/habits";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"],
  })
);

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/habits", habitsRoutes);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => console.log(`API running at http://localhost:${port}`));
