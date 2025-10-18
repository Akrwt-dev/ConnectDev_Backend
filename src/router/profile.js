// router/profile.js
const express = require("express");
const bcrypt = require("bcrypt");
const { updateData } = require("../utils/validation.js");
const { userAuth } = require("../../middlewares/auth.js");

const profileRouter = express.Router();

// View profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

// Edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!updateData(req)) throw new Error("Cannot update this");

    const loginUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loginUser[key] = req.body[key];
    });

    await loginUser.save();

    res.json({
      message: "Data updated successfully",
      data: loginUser,
    });
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

// Change password
profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const hash = req.user.password;

    const isPasswordCorrect = await bcrypt.compare(currentPassword, hash);
    if (!isPasswordCorrect) throw new Error("Wrong Password!");

    const hashPassword = await bcrypt.hash(newPassword, 10);
    req.user.password = hashPassword;
    await req.user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

module.exports = profileRouter;
