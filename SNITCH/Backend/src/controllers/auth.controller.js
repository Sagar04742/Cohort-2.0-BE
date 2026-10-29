import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

function setAuthCookie(user, res){
    const token = jwt.sign({
        id:user._id,
    },config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

function serializeUser(user){
    return {
        id:user._id,
        email: user.email,
        contact: user.contact,
        fullname: user.fullname,
        role: user.role
    }
}

async function sendTokenResponse(user,res , message){
    setAuthCookie(user, res);

    res.status(200).json({
        message,
        sucess: true,
        user: serializeUser(user)
    })
}

export const register = async (req, res) => {
    const { email , contact , password , fullname , isSeller } = req.body;

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
            fullname,
            role: isSeller ? "seller" : "buyer"
        })

        await user.save();
        await sendTokenResponse(user, res , "User registered sucessfully");


    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const login = async (req, res) => {
    const { email , password } = req.body;

    try{
        const user = await userModel.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({message:"Invalid email or password"});
        }

        await sendTokenResponse(user, res , "User logged in sucessfully");

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const googleLogin = async (req, res) => {
    setAuthCookie(req.user, res);

    res.redirect(`${config.FRONTEND_URL}/`);
}

export const getMe = async (req, res) => {
    res.status(200).json({
        sucess: true,
        user: serializeUser(req.user)
    })
}
