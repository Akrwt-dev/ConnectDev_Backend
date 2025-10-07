const express = require("express");
const authRouter = express.Router();
const User = require("../modules/user.js");
const { ValidatSignUpData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const { userAuth } = require("../../middlewares/auth.js");

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Details");
    }
    const IsUserCorrect = await user.validatePassword(password);
    if (IsUserCorrect) {
      // Create a Token
      const token = await user.getJWT();

      // Adding the token to cookie and sending the response back to the user
      res.cookie("token", token);
      res.send("token sended");
    } else {
      throw new Error("Invalid Details");
    }
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
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
    await user.save();
    res.send("data added to dataBase");
  } catch (err) {
    res.status(404).send("ERROR" + err);
  }
});
authRouter.post("/logout", async(req,res)=>{
  res.cookie("token",null,{ expires: new Date(Date.now())})
  res.send("You have successfully log_out")
})

module.exports = authRouter;
