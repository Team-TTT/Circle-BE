const { CHANNEL } = require("../../constants");
const logger = require("../../../libs/logger");
const { chain } = require("../../utils/fp");

const users = {};
const socketToRoom = {};

const handleOnJoinRoom = chain(({ socket }) => {
  socket.on(CHANNEL.JOIN, (channelId) => {
    logger.info("유저 가 방에 입장: ", users[channelId]?.length || 0);
    // Todo: 콘솔 삭제
    console.log(channelId);
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
    // Todo: 콘솔 삭제
    console.log("기존 콜리스", calleesInThisChannel);
    console.log("유저 접속후 채팅방", users[channelId]);

    socket.emit(CHANNEL.EXISTED_CALLEES, calleesInThisChannel);
  });
});

const handleOnCallerToCallee = chain(({ socket, io }) => {
  socket.on(CHANNEL.OFFER, ({ callerId, calleeId, signal }) => {
    // Todo: 콘솔 삭제
    console.log("callerTocalle_offeer");
    io.to(calleeId).emit(CHANNEL.USER_JOIN, {
      signal,
      callerId,
    });
  });
});

const handleOnCalleeToCaller = chain(({ socket, io }) => {
  socket.on(CHANNEL.ANSWER, ({ callerId, signal }) => {
    // Todo: 콘솔 삭제
    console.log("calleeToCaller return then signal");

    io.to(callerId).emit(CHANNEL.RETURN_SIGNAL, {
      signal,
      calleeId: socket.id,
    });
  });
});

const handleOnDisconnection = chain(({ socket }) => {
  socket.on("disconnect", () => {
    const channelId = socketToRoom[socket.id];

    logger.info(`${socket.id}가 ${channelId}방을 퇴장하였습니다`);

    const room = users[channelId];

    if (room) {
      users[channelId] = room.filter((id) => id !== socket.id);
    }

    // Todo: 콘솔 삭제
    console.log(users[channelId]);

    socket.broadcast.emit(CHANNEL.USER_DISCONNECT, socket.id);
  });
});

module.exports = {
  handleOnJoinRoom,
  handleOnCallerToCallee,
  handleOnCalleeToCaller,
  handleOnDisconnection,
};
