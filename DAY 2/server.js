const express = require('express')

const app = express()

app.get('/', (req,res)=>{
    res.send("Hello World!!")
})

app.get('/home',(req,res)=>{
    res.send('Welcome to home!!')
})

app.listen(3000)
 