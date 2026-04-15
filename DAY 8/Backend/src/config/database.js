const mongoose = require('mongoose')

function connectTODb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Connected to database')
    })
}

module.exports = connectTODb