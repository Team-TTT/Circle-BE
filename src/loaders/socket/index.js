const { Server } = require("socket.io");

const logger = require("../../../libs/logger");
const { go, chain } = require("../../utils/fp");
const {
  onJoinRoomHandle,
  onLeaveRoomHandle,
  onCalleesHandle,
  onCallerHandle,
  onDisconnectionHandle,
} = require("./controller");

const connectSocket = chain((server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info(`user(${socket.id}) is connected`);

    go(
      { socket, io },
      onJoinRoomHandle,
      onLeaveRoomHandle,
      onCalleesHandle,
      onCallerHandle,
      onDisconnectionHandle,
    );
  });
});

module.exports = connectSocket;
