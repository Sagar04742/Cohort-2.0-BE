const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

async function followUserController(req,res){

    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isFolloweeExist = await userModel.findOne({username : followeeUsername})
    if(!isFolloweeExist){
        return res.status(404).json({
            message: "User you are trying to follow doesn't exist"
        })
    }


    if(followerUsername === followeeUsername){
        return res.status(400).json({
            message: "You can't follow yourself"
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(isAlreadyFollowing){
        return res.status(200).json({
            message: `You are already following ${followeeUsername}`
        })
    }

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername
    })

    res.status(201).json({
        message : `You are now following ${followeeUsername}`,
        follow : followRecord
    })

}

async function unfollowUserController(req,res){
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower : followerUsername,
        followee : followeeUsername
    })
    if(!isUserFollowing){
        return res.status(200).json({
            message: `You aren't following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete( isUserFollowing._id)

    res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}

module.exports = {followUserController , unfollowUserController}