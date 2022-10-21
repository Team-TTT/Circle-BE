const { CHANNEL } = require("../../constants");
const logger = require("../../../libs/logger");
const { chain } = require("../../utils/fp");

const users = {};
const socketToRoom = {};

const onJoinRoomHandle = chain(({ socket, io }) => {
  socket.on(CHANNEL.JOIN, (channelId) => {
    socket.join(channelId);

    logger.info(`${socket.id}가 ${channelId}방을 입장 하였습니다`);

    if (users[channelId]) {
      const { length } = users[channelId];

      if (length === CHANNEL.MAX_USER_COUNT) {
        socket.emit(CHANNEL.FULL_ROOM);
        return;
      }

      users[channelId].push(socket.id);
    } else {
      users[channelId] = [socket.id];
    }

    socketToRoom[socket.id] = channelId;

    const calleesInThisChannel = users[channelId].filter(
      (id) => id !== socket.id,
    );

    socket.emit(CHANNEL.EXISTED_USERS, calleesInThisChannel);
  });
});

const onLeaveRoomHandle = chain(({ socket, io }) => {
  socket.on(CHANNEL.LEAVE, (channelId) => {
    logger.info(`${socket.id}가 ${channelId}방을 퇴장 하였습니다.`);

    socket.leave(channelId);
  });
});

const onCalleesHandle = chain(({ socket, io }) => {
  socket.on(CHANNEL.OFFER, (payload) => {
    io.to(payload.calleeId).emit(CHANNEL.USER_JOIN, {
      signal: payload.signal,
      callerId: payload.callerId,
    });
  });
});

const onCallerHandle = chain(({ socket, io }) => {
  socket.on(CHANNEL.ANSWER, (payload) => {
    io.to(payload.callerId).emit(CHANNEL.RETURN_SIGNAL, {
      signal: payload.signal,
      calleeId: socket.id,
    });
  });
});

const onDisconnectionHandle = chain(({ socket, io }) => {
  socket.on("disconnect", () => {
    const channelId = socketToRoom[socket.id];
    let room = users[channelId];

    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[channelId] = room;
    }

    logger.info(`user(${socket.id}}) disconnected`);
  });
});

module.exports = {
  onJoinRoomHandle,
  onLeaveRoomHandle,
  onCalleesHandle,
  onCallerHandle,
  onDisconnectionHandle,
};
