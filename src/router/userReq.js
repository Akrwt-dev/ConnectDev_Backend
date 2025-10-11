const express = require("express");
const { userAuth } = require("../../middlewares/auth");
const connectionRequest = require("../modules/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loginUser = req.user;

    const ConnectionRequest = await connectionRequest
      .find({
        toUserId: loginUser._id,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName ");

    res.json({
      message: "here are your recevied requests",
      data: ConnectionRequest,
    });
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const logginUser = req.user;

    const connection = await connectionRequest.find({
      $or: [
        { toUserId: logginUser, status: "accepted" },
        { fromUserId: logginUser, status: "accepted" },
      ],
    });
    const data = connection.map((row) => {
      if (row.fromUserId._id.toString() === logginUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({
      data: data,
    });
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

module.exports = userRouter;
