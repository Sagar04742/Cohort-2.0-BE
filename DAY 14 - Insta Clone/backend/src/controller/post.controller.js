const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  console.log(req.user);

  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "Cohort-2-instaClone-Posts",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  res.status(201).send({ message: "Post created successfully", post });
}

async function getPostController(req, res) {
  try {
    const userId = req.user.id;

    const posts = await postModel.find({
      user: userId,
    });

    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forrbidden Content",
    });
  }

  res.status(200).json({
    message: "Post fetched successfully",
    post,
  });
}

async function likePostController(req, res) {
  try {
    const username = req.user.username;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isAlreadyLiked = await likeModel.findOne({
      post: postId,
      user: username,
    });

    if (isAlreadyLiked) {
      return res.status(409).json({
        message: "You have already liked this post",
      });
    }

    const like = await likeModel.create({
      post: postId,
      user: username,
    });

    const likeCount = await likeModel.countDocuments({ post: postId });

    res.status(201).json({
      message: "Post liked successfully",
      like,
      likeCount,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function unlikePostController(req, res) {
  try {
    const username = req.user.username;
    const postId = req.params.postId;

    const likeRecord = await likeModel.findOne({
      post: postId,
      user: username,
    });

    if (!likeRecord) {
      return res.status(404).json({
        message: "Like not found",
      });
    }

    await likeModel.findByIdAndDelete(likeRecord._id);
    const likeCount = await likeModel.countDocuments({ post: postId });

    res.status(200).json({
      message: "Post unliked successfully",
      likeCount,
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getFeedController(req, res) {
  const user = req.user;
  const posts = await Promise.all(
    (await postModel.find().populate("user").lean()).map(async (post) => {
      const isLiked = await likeModel.findOne({
        user: user.username,
        post: post._id,
      });

      const likeCount = await likeModel.countDocuments({ post: post._id });

      post.isLiked = !!isLiked;
      post.likeCount = likeCount;

      return post;
    }),
  );
  res.status(200).json({
    message: "posts fetched successfully",
    posts,
  });
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  unlikePostController,
  getFeedController,
};
