
const socket = require("socket.io");
const { Chat } = require("../modules/chat");

const initialseRequest = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({firstName, userId, targetUserId}) => {
        const roomId = [userId, targetUserId].sort().join("_");
        console.log(roomId)
        socket.join(roomId);
    });
    socket.on("sendMessage", async({firstName, lastName, userId, targetUserId, text}) => {
      const roomId = [userId, targetUserId].sort().join("_");
      try{
        let chat = await Chat.findOne({
          participants:{$all : [userId, targetUserId]},
        })
        if(!chat){
          chat = new Chat({
            participants:[userId,targetUserId],
            messages:[],
          })
        }
        chat.messages.push({
          senderId:userId,
          text,
        })
        await chat.save()
      }catch(err){console.log(err)}
      io.to(roomId).emit("messageReceived",{firstName, text});
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initialseRequest;