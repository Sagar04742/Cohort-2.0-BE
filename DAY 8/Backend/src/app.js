const express = require("express");
const noteModel = require("./model/note.model");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

// CREATE
app.post("/api/notes", async (req, res) => {
  try {
    const { title, description } = req.body;

    const note = await noteModel.create({ title, description });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await noteModel.find();

    res.status(200).json({
      message: "Data fetched successfully",
      notes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await noteModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.patch("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;

    await noteModel.findByIdAndUpdate(id, { title, description });

    res.status(200).json({
      message: "Note updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FIXED CATCH-ALL ROUTE
app.use("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;