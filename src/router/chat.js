const { userAuth } = require("../../middlewares/auth");
const { Chat } = require("../modules/chat");
const express = require("express");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  console.log("API HIT");

  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    return res.json(chat);

  } catch (error) {
    console.error("Chat API Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = chatRouter;
