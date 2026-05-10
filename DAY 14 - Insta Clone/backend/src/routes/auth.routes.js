const express = require("express");
const { registerController, loginController, getMecontroller, logoutController } = require("../controller/auth.controller");
const { identifyUser } = require('../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post("/register", registerController);

authRouter.post("/login", loginController);

authRouter.get('/getMe', identifyUser, getMecontroller);

authRouter.post('/logout', logoutController);

module.exports = authRouter;
