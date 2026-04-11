const app = require("./src/app");


app.listen(3000, () => {
  console.log("Server is live at PORT 3000");
});

const Notes = [];

app.post("/notes", (req, res) => {
  Notes.push(req.body);
  res.send("Notes Created");
  console.log("Notes created");
});

app.get("/notes", (req, res) => {
  res.send(Notes)
});

app.delete('/notes/:index',(req,res)=>{
    delete Notes[req.params.index]
    res.send(Notes)
    res.send('Note deleted.')
})

app.patch('/notes/:index',(req,res)=>{
    Notes[req.params.index].description = req.body.description
    req.send(Notes)
})