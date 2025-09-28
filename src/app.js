const express = require("express");
const app = express();
const { checkAdmin, checkUser } = require("../middlewares/auth.js");

app.use("/user", checkUser);

app.use("/user/login", (req, res) => {
  res.send("user has successfully login");
});

app.get("/user/data", (req, res) => {
  res.send("Here is user data");
});

app.use("/admin", checkAdmin);

app.get("/admin/getAllData", (req, res) => {
  res.send("All data sended");
});
app.get("/admin/deleteUser", (req, res) => {
  res.send("user deleted");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
