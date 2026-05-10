const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");

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
      if (existingFollow.status === "accepted") {
        return res.status(409).json({ message: `You are already following ${followeeUsername}` });
      }

      existingFollow.status = "pending";
      await existingFollow.save();

      return res.status(200).json({
        message: `Follow request resent to ${followeeUsername}`,
        follow: existingFollow,
      });
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
    console.error("Error creating follow request:", err);
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
        status: "pending",
      },
      {
        status: action,
      },
      { new: true },
    );

    if (!followRespond) {
      return res.status(404).json({ message: "Pending follow request not found." });
    }

    res.status(200).json({
      message: `Successfully ${action} the request`,
      follow: followRespond,
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
      status: "accepted",
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
    console.error("Error unfollowing user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getProfileController(req, res) {
  try {
    const username = req.user.username;
    const user = await userModel.findOne({ username }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersCount = await followModel.countDocuments({ followee: username, status: "accepted" });
    const followingCount = await followModel.countDocuments({ follower: username, status: "accepted" });
    const pendingRequests = await followModel.find({ followee: username, status: "pending" }).sort({ createdAt: -1 }).lean();
    const postCount = await postModel.countDocuments({ user: user._id });

    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
      },
      stats: {
        followersCount,
        followingCount,
        pendingRequestsCount: pendingRequests.length,
        postCount,
      },
      pendingRequests: pendingRequests.map((request) => ({
        id: request._id,
        follower: request.follower,
      })),
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getUserProfileController(req, res) {
  try {
    const username = req.params.username;
    const currentUsername = req.user.username;

    const user = await userModel.findOne({ username }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersCount = await followModel.countDocuments({ followee: username, status: "accepted" });
    const followingCount = await followModel.countDocuments({ follower: username, status: "accepted" });
    const postCount = await postModel.countDocuments({ user: user._id });

    const relationship = await followModel.findOne({
      follower: currentUsername,
      followee: username,
    });

    res.status(200).json({
      user: {
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
      },
      stats: {
        followersCount,
        followingCount,
        postCount,
      },
      relation: {
        isSelf: currentUsername === username,
        isFollowing: relationship?.status === "accepted",
        followRequestStatus: relationship?.status || "none",
      },
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getPendingFollowRequestsController(req, res) {
  try {
    const username = req.user.username;
    const pendingRequests = await followModel.find({ followee: username, status: "pending" }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      pendingRequests: pendingRequests.map((request) => ({
        id: request._id,
        follower: request.follower,
      })),
    });
  } catch (err) {
    console.error("Error fetching follow requests:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  followUserController,
  unfollowUserController,
  respondFollowRequestController,
  getProfileController,
  getUserProfileController,
  getPendingFollowRequestsController,
};