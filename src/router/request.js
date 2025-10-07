const express = require("express");
const requestRouter = express.Router();
const User = require("../modules/user.js");
const { userAuth } = require("../../middlewares/auth.js");

requestRouter.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const ALLOW_UPDATE = [
      "userId",
      "photoURL",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOW_UPDATE.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("you can not update is ");
    }
    const dataToUpdate = await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("User not found" + err);
  }
});

requestRouter.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const seleteUser = await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (err) {
    res.status(400).send("User not found" + err);
  }
});

requestRouter.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(400).send("User not found" + err);
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

module.exports = requestRouter;
