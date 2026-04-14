const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    age: Number,
    sec: String
})

const userModel = new mongoose.model('User',userSchema)

module.exports = userModel