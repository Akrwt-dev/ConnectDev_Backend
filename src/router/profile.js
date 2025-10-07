const express = require("express");
const { updateData } = require("../utils/validation.js");
const profileRouter = express.Router();
const { userAuth } = require("../../middlewares/auth.js");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});
profileRouter.patch("/profile/edit", userAuth, (req, res) => {
  try {
    if (!updateData(req)) {
      throw new Error("can not update this");
    }
    const loginUser = req.user;
    console.log(loginUser);
    Object.keys(req.body).every((key) => (loginUser[key] = req.body[key]));
    res.json({
      message: `data updated successfully`,
      data: loginUser,
    });
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const hash = req.user.password;
    const isPasswordCorrect = await bcrypt.compare(currentPassword, hash);
    if (!isPasswordCorrect) {
      throw new Error("Wrong Password !");
    }
    const { newPassword } = req.body;
    const hashPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashPassword)
    req.user.password = hashPassword;
    await req.user.save();
    res.send("Password Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

module.exports = profileRouter;
