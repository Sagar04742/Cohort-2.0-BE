const app = require("./src/app");
const mongoose = require("mongoose");

const connectToDb = () => {
  mongoose
    .connect(
      "mongodb+srv://Sagar:O0plzq5Vflq8xWh3@cluster0.m8c5fs6.mongodb.net/Day-6",
    )
    .then(() => {
      console.log("connected to Database");
    })
}
connectToDb()

app.listen(3000, () => {
  console.log("Server started at PORT 3000");
});

const users = [];

//  Creating users
app.post("/users", (req, res) => {
  users.push(req.body);

  res.status(201).json({
    message: "User created",
  });
});

//  Reading or getting users
app.get("/users", (req, res) => {
  res.status(200).json({
    Users: users,
  });
  console.log(users);
});

//Delete users
app.delete("/users/:id", (req, res) => {
  delete users[req.params.id];

  res.status(200).json({
    message: "User deleted",
  });
});

//Update
app.patch("/users/:id", (req, res) => {
  users[req.params.id].age = req.body.age;

  res.status(200).json({
    age: "Modified",
  });
});

//Change everything
app.put("/users/:id", (req, res) => {
  const id = req.params.id;

  if (!users[id]) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  users[id] = req.body;

  res.status(200).json({
    message: "Changed user data",
    Users: users[id],
  });
});
