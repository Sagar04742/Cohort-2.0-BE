const express = require("express");
const userModel = require("./model/user.model");

const app = express();

app.use(express.json());

app.post("/users",async (req, res) => {
  const { name, age, sec } = req.body;

  const user = await userModel.create({
        name,age,sec,
  })
  
  res.status(201).json({
    message : "User created",
    user
  })

})

app.get("/users",async (req,res)=>{

    const user = await userModel.find()

    res.status(200).json({
        message : "Notes fetched successfully",
        user
        
    })
})

module.exports = app;
