import { Router } from "express";
import {
  getMe,
  login,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/registter
 * @desc Register a new user
 * @access Public
 * @body {username, email , password}
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login user and return a token
 * @access Public
 * @body {email , password}
 */
authRouter.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get("/get-me", authUser, getMe);

/**
 * @route POST /api/auth/verify-email
 * @desc Verify user's email
 * @access Public
 * @query { token}
 */
authRouter.get("/verify-email", loginValidator, verifyEmail);

export default authRouter;
