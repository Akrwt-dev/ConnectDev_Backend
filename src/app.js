const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/test", (req, res) => {
  res.send("Test page");
});

app.get("/user", (req, res) => {
  res.send("User page");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
