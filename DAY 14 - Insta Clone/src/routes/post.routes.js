const express = require('express');
const multer = require('multer')
const { createPostController, getPostController, getPostDetailsController } = require('../controller/post.controller');
const { identifyUser } = require('../middlewares/auth.middleware');
const postRouter = express.Router()

const upload = multer({storage: multer.memoryStorage()})




postRouter.post('/', upload.single("image"), identifyUser , createPostController)
postRouter.get('/', identifyUser , getPostController)
postRouter.get('/details/:postId', identifyUser, getPostDetailsController)


module.exports = postRouter;