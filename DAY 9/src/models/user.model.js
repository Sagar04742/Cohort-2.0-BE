const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:[true, "Name already exists"]
    },
    email:{
        type:String,
        unique:[true, "Email already exists"]
    },
    password:{
        type:String,
    }
})

const userModel = mongoose.model('Users',userSchema)

module.exports = userModel