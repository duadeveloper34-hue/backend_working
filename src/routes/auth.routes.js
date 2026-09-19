import express from "express";

import * as authController from "../controllers/auth.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.get("/getme", authMiddleware, authController.getme);

export default router;
