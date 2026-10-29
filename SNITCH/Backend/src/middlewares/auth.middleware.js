import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { config } from "../config/config.js";

export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({message:"Not authenticated"});
    }

    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({message:"Not authenticated"});
        }

        req.user = user;
        next();
    }catch(err){
        return res.status(401).json({message:"Invalid or expired token"});
    }
}
