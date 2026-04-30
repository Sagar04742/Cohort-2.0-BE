const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: [true, "Post id required to like a post"]
    },
    user:{
        type:String,
        required: [true, "username required to like a post"]
    }
},{
    timestamps : true
})

likeSchema.index({post: 1, user: 1} ,{unique: true})

const likeModel = mongoose.model("Likes",likeSchema)

module.exports = likeModel