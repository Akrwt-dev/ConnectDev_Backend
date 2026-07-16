const express = require("express");
const authRouter = express.Router();
const User = require("../modules/user.js");
const { ValidatSignUpData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const { userAuth } = require("../../middlewares/auth.js");

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Details");
    }

    const IsUserCorrect = await user.validatePassword(password);

    if (!IsUserCorrect) {
      throw new Error("Invalid Details");
    }

    const token = await user.getJWT();
    res.cookie("token", token, {
      ...cookieOptions,
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.send(user);
  } catch (err) {
    return res.status(401).send("Something went wrong: " + err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    ValidatSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    // Encript the password
    const hashPassword = await bcrypt.hash(password, 10);
    // Creating a new instance of User modle
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, cookieOptions);
    res.json({ message: "data added to dataBase", data: savedUser });
  } catch (err) {
    res.status(404).send("ERROR" + err);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    ...cookieOptions,
    expires: new Date(Date.now()),
  });
  res.send("You have successfully log_out");
});

module.exports = authRouter;
