const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./modules/user.js");
const user = require("./modules/user.js");
const { ValidatSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../middlewares/auth.js")


app.use(express.json());
app.use(cookieParser());

app.get("/profile",userAuth, async (req, res) => {
  try {
   const user = req.user
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Details");
    }
    const IsUserCorrect = await bcrypt.compare(password, user.password);
    if (IsUserCorrect) {
      // Create a Token
      const token = jwt.sign({ _id: user._id }, "DEV@Tinder790");

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

app.patch("/user", async (req, res) => {
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

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const seleteUser = await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (err) {
    res.status(400).send("User not found" + err);
  }
});

app.get("/user", async (req, res) => {
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

app.post("/signup", async (req, res) => {
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
