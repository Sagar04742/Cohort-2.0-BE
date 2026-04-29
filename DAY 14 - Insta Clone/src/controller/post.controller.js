const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

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

  const post = await postModel.findById(postId );

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const isValidUser = post.user.toString() === userId 

  if(!isValidUser){
    return res.status(403).json({
      message: "Forrbidden Content"
    })
  }

  res.status(200).json({
    message: "Post fetched successfully",
    post
  })





}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
};
