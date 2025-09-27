const express = require("express");
const app = express();

// here order is very importent 
app.use("/test/2", (req, res) => {
  res.send("this is the second test page");
});

app.use("/test", (req, res) => {
  res.send("First Test page");
});
// this will never show because of "/test" 
app.use("/test/3", (req, res) => {
  res.send("Third Test page");
});

app.use("/user", (req, res) => {
  res.send("User page");
});

app.use("/", (req, res) => {
  res.send("Home page");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
