const express = require('express')

const app = express()

app.use(express.json())

const notes = []

app.post('/notes',(req,res)=>{

    notes.push(req.body)
    res.status(201).json({
        message: "Note created successfully"
    })

})

app.get('/notes',(req,res)=>{
    res.status(200).json({
        Notes :notes
    })
})

app.delete('/notes/:index',(req,res)=>{
    delete notes[req.params.index]

    res.status(204).json({
        message: "Note deleted successfully"
    })
}) // if we use status code - 204 we do not get any message


app.patch('/notes/:id',(req,res)=>{
    notes[req.params.id].description = req.body.description
    res.status(200).json({
        message: "Note updated successfully"
    })

})


module.exports = app
