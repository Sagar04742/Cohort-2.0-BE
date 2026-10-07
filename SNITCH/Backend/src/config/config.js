import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI does not exists.")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET does not exists.")
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
}