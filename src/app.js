import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import noteRoutes from "./routes/note.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "";

const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((origin) => origin.trim());

app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS policy"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running!",
  });
});

app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/auth", authRoutes);

export default app;
