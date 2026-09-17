import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import noteRoutes from "./routes/note.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running!",
  });
});

app.use("/api/v1/notes", noteRoutes);

export default app;
