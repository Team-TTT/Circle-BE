const { Server } = require("socket.io");
const logger = require("../../libs/logger");
const CHANNEL = require("../constants/CHANNEL");

const connectSocket = (server) => {
  const io = new Server(server);

  const joinAndLeaveRoom = (socket) => {
    socket.on(CHANNEL.JOIN, (channelId) => {
      logger.info(`유저가 ${channelId}방에 입장 하였습니다`);

      socket.join(channelId);
    });

    socket.on(CHANNEL.LEAVE, (channelId) => {
      logger.info(`유저가 ${channelId}방을 퇴장 하였습니다`);

      socket.leave(channelId);
    });
  };

  const sendAndReceiveData = (socket) => {
    socket.on(CHANNEL.USER_SEND, (channelId, data) => {
      io.to(channelId).emit(CHANNEL.BROADCAST, data);
    });
  };

  io.on(CHANNEL.CONNECTION, (socket) => {
    const { address } = socket.handshake;
    logger.info(`user(IPv6: ${address}) is connected`);

    joinAndLeaveRoom(socket);
    sendAndReceiveData(socket);

    socket.on(CHANNEL.DISCONNECT, () => {
      logger.info(`user(IPv6: ${address}) disconnected`);
    });
  });
};

module.exports = connectSocket;
