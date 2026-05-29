import express from "express";
import { register } from "../controllers/auth.controller.js";
import { registerValidation } from "../validation/auth.validator.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidation, register);

export default authRouter;
