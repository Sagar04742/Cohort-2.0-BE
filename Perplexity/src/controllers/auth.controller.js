import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

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
        err: "User already exists"
      });
    }

    const user = await userModel.create({ username, email, password });

    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        html: `<h1>Welcome to Perplexity</h1>
        <p>Thank you for registering with us, ${username}!</p>`,
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
