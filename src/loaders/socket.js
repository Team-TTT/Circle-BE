const { Server } = require("socket.io");

const logger = require("../../libs/logger");
const { CHANNEL } = require("../constants");
const { go } = require("../utils/fp");

const joinAndLeaveRoom = (socket) => {
  socket.on(CHANNEL.JOIN, (channelId) => {
    logger.info(`유저가 ${channelId}방에 입장 하였습니다`);

    socket.join(channelId);
  });

  socket.on(CHANNEL.LEAVE, (channelId) => {
    logger.info(`유저가 ${channelId}방을 퇴장 하였습니다`);

    socket.leave(channelId);
  });

  return socket;
};

const receiveAndSendData = (socket) => {
  socket.on(CHANNEL.USER_SEND, (channelId, data) => {
    socket.to(channelId).emit(CHANNEL.BROADCAST, data);
  });
};

const connectSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    const { address } = socket.handshake;
    logger.info(`user(IPv6: ${address}) is connected`);

    go(
      socket,
      joinAndLeaveRoom,
      receiveAndSendData,
    );

    socket.on("disconnect", () => {
      logger.info(`user(IPv6: ${address}) disconnected`);
    });
  });

  return server;
};

module.exports = connectSocket;
