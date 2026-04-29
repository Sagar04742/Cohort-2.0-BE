const express = require('express');
const multer = require('multer')
const { createPostController, getPostController, getPostDetailsController } = require('../controller/post.controller');
const postRouter = express.Router()

const upload = multer({storage: multer.memoryStorage()})




postRouter.post('/', upload.single("image"),createPostController)
postRouter.get('/', getPostController)
postRouter.get('/details/:postId', getPostDetailsController)


module.exports = postRouter;