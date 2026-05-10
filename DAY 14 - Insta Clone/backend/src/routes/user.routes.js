const express = require("express");
const {
  followUserController,
  unfollowUserController,
  respondFollowRequestController,
  getProfileController,
  getUserProfileController,
  getPendingFollowRequestsController,
} = require("../controller/user.controller");
const { identifyUser } = require("../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.get("/profile", identifyUser, getProfileController);
userRouter.get("/follow-requests", identifyUser, getPendingFollowRequestsController);
userRouter.get("/:username", identifyUser, getUserProfileController);
userRouter.post("/follow/:username", identifyUser, followUserController);
userRouter.post("/unfollow/:username", identifyUser, unfollowUserController);
userRouter.patch("/follow-request/:username", identifyUser, respondFollowRequestController);

module.exports = userRouter;
