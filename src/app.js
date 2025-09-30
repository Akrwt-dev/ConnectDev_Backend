const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./modules/user.js");

app.use(express.json())

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send("data added to dataBase");
});

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(4000, () => {
      console.log("Server running on port 4000");
    });
  })
  .catch((err) => {
    console.error("DB is not connected, something went wrong:", err);
  });
