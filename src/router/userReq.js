const express = require("express");
const { userAuth } = require("../../middlewares/auth");
const connectionRequest = require("../modules/connectionRequest");
const User = require("../modules/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loginUser = req.user;

    const ConnectionRequest = await connectionRequest
      .find({
        toUserId: loginUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

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

    const connection = await connectionRequest
      .find({
        $or: [
          { toUserId: logginUser, status: "accepted" },
          { fromUserId: logginUser, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connection.map((row) => {
      if (row.fromUserId._id.toString() === logginUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({
      data,
    });
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  const logginUser = req.user;
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  limit = limit > 50 ? 50 : limit;
  const ConnectionRequest = await connectionRequest
    .find({
      $or: [{ toUserId: logginUser._id }, { fromUserId: logginUser._id }],
    })
    .select("fromUserId toUserId");
  const hideUserFromFeed = new Set();
  ConnectionRequest.forEach((req) => {
    hideUserFromFeed.add(req.fromUserId._id.toString());
    hideUserFromFeed.add(req.toUserId._id.toString());
  });

  const user = await User.find({
    $and: [
      { _id: { $nin: Array.from(hideUserFromFeed) } },
      { _id: { $ne: logginUser._id } },
    ],
  })
    .select("firstName lastName gender age skills photoURL about")
    .skip(skip)
    .limit(limit);
  res.send(user);
});

module.exports = userRouter;
