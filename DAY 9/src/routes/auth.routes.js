const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("jwt_token", token)

    res.status(201).json({
      message: "User registered successfully",
      user,
      token
    });
  } catch (error) {
    res.status(400).json({
      message: "Error registering user",
      error,
    });
  }
});
module.exports = authRouter;
