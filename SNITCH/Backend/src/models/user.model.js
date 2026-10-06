import mongoose, { model } from 'mongoose'

const userShema = new mongoose.Schema({
    email:{type:String , required: true , unique: true},
    contact:{type:String , required: true},
    password:{type:String , required: true},
    fullname:{type:String , required: true},
    role:{
        type:String,
        enum:["buyer","seller"],
        default: "buyer"
    }
})

userModel = mongoose.model("user",userShema);

export default userModel