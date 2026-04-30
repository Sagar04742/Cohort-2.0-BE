const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUserController(req, res) {
  try {
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    const isFolloweeExist = await userModel.findOne({
      username: followeeUsername,
    });
    
    if (!isFolloweeExist) {
      return res.status(404).json({
        message: "User you are trying to follow doesn't exist",
      });
    }

    if (followerUsername === followeeUsername) {
      return res.status(400).json({
        message: "You can't follow yourself",
      });
    }

    const existingFollow = await followModel.findOne({
      follower: followerUsername,
      followee: followeeUsername,
    });

    if (existingFollow) {
      if (existingFollow.status === "pending") {
        return res.status(409).json({ message: "Follow request is already pending" });
      }
      return res.status(409).json({ message: `You are already following ${followeeUsername}` });
    }

    const followRecord = await followModel.create({
      follower: followerUsername,
      followee: followeeUsername,
    });

    res.status(201).json({
      message: `Your request to follow ${followeeUsername} has successfully sent.`,
      follow: followRecord,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function respondFollowRequestController(req, res) {
  try {
    const followeeUsername = req.user.username; 
    const followerUsername = req.params.username; 
    const { action } = req.body;

    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Use 'accepted' or 'rejected'." });
    }

    const followRespond = await followModel.findOneAndUpdate(
      {
        follower: followerUsername,
        followee: followeeUsername,
        status: "pending" 
      },
      {
        status: action,
      },
      { new: true } 
    );

    if (!followRespond) {
      return res.status(404).json({ message: "Pending follow request not found." });
    }

    res.status(200).json({
      message: `Successfully ${action} the request`,
    });
    
  } catch (err) {
    console.error("Error responding to follow request:", err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

async function unfollowUserController(req, res) {
  try {
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    const isUserFollowing = await followModel.findOne({
      follower: followerUsername,
      followee: followeeUsername,
    });
    
    if (!isUserFollowing) {
      return res.status(400).json({
        message: `You aren't following ${followeeUsername}`,
      });
    }

    await followModel.findByIdAndDelete(isUserFollowing._id);

    res.status(200).json({
      message: `You have unfollowed ${followeeUsername}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  followUserController,
  unfollowUserController,
  respondFollowRequestController,
};