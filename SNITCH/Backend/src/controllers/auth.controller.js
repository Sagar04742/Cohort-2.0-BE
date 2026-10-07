import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user,res){
    const token = jwt.sign({
        id:user._id,
    },config.JWT_SECRET)

    res.cookie("token", token)
}

export const register = async (req, res) => {
    const { email , contact , password , fullname } = req.body;

    try{
        const existingUser = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ],
        });

        if (existingUser) {
            return res.status(400).json({message:"User already exists"});
        }

        const user = new userModel({
            email,
            contact,
            password,
            fullname
        })

        await user.save();
        await sendTokenResponse(user, res);
        res.status(201).json({message:"User registered successfully"});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
}