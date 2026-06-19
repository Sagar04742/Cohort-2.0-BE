import "dotenv/config";
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
        success: false,
        err: "User already exists",
      });
    }

    const user = await userModel.create({ username, email, password });

    const emailVarificationToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a2e;">Hey ${username}! 👋</h2>
        <p style="color: #555; font-size: 15px;">
          Welcome to <strong>Perplexity</strong>. We're glad to have you on board.
        </p>
        <p>
          Please click the link below to verify your email address:
        </p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVarificationToken}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p style="color: #999; font-size: 12px;">
          If you didn't create this account, ignore this email.
        </p>
      </div>
    `,
        text: `Hey ${username}, welcome to Perplexity!`,
      });
    } catch (mailError) {
      console.error("Failed to send welcome email:", mailError);
    }

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    const isPasswordMatch = await user.comparePassword(password)

    if(! isPasswordMatch){
      return res.status(400).json({
        message : "Invalid email or password",
        success: false,
        err: "Incorrect password"}
      )
    }

    if(!user.verified){
      return res.status(400).json({
        messgae: "Please verify your email before logging in",
        success: false,
        err: "Email not verified"
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      success: false,
      err: error.message,
    });
  }
}

export async function getMe(req,res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(400).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  return res.status(200).json({
    message: "User retrieved successfully",
    success: true,
    user,
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({
      email: decoded.email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: true,
        err: "User not found",
      });
    }

    user.verified = true;

    await user.save();

    const html = `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1a1a2e;">Email Verified! 🎉</h2>
      <p style="color: #555; font-size: 15px;">
        Your email has been successfully verified. You can now log in to your account.
      </p>
      <a href="${process.env.FRONTEND_URL}/login" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Login</a>
    </div>`;

    return res.send(html);
  } catch (error) {
    res.status(500).json({
      message: "Invalid or expired password",
      success: false,
      err: error.message,
    });
  }
}
