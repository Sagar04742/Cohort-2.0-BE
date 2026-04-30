const express = require("express");
const { followUserController, unfollowUserController, respondFollowRequestController } = require("../controller/user.controller");
const { identifyUser } = require("../middlewares/auth.middleware");



const userRouter = express.Router();



userRouter.post("/follow/:username", identifyUser, followUserController);

userRouter.patch("/followRequest/:username",identifyUser, respondFollowRequestController )

userRouter.post("/unfollow/:username", identifyUser , unfollowUserController)

module.exports = userRouter;
