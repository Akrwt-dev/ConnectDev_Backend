const express = require("express");
const requestRouter = express.Router();
const User = require("../modules/user.js");
const { userAuth } = require("../../middlewares/auth.js");
const connectionRequest  = require("../modules/connectionRequest.js");

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

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.userId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.send("Invalid Connection Request");
      }
      const isReciverPresent = await User.findById(toUserId);
      if (!isReciverPresent) {
        throw new Error("User not found");
      }
      const isDuplicateReq = await connectionRequest.findOne({
        $or: [
          { toUserId: toUserId, fromUserId: fromUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });

      if (isDuplicateReq) {
        throw new Error("Request already send");
      }
      const sendRequest = new connectionRequest({
        toUserId,
        fromUserId,
        status,
      });
      const data = await sendRequest.save();
      res.json({
        message: "sended the connection req",
        data,
      });
    } catch (err) {
      res.status(400).send("Something went wrong" + err);
    }
  }
);

module.exports = requestRouter;
