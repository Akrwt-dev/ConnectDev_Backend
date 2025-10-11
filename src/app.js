const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const user = require("./modules/user.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./router/auth.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/request.js");
const userRouter = require("./router/userReq.js");
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
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
