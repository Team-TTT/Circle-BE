const { CHANNEL } = require("../../constants");
const logger = require("../../../libs/logger");
const { chain } = require("../../utils/fp");

const usersMap = new Map();
const socketToRoomMap = new Map();

const handleOnJoinRoom = chain(({ socket }) => {
  socket.on(CHANNEL.JOIN, (channelId) => {
    socket.join(channelId);

    logger.info(`${socket.id}가 ${channelId}방을 입장 하였습니다. 기존 유저수: ${usersMap.get(channelId)?.length || 0}명`);

    if (usersMap.has(channelId)) {
      const room = usersMap.get(channelId);

      if (room.length === CHANNEL.MAX_USER_COUNT) {
        socket.emit(CHANNEL.FULL_ROOM);

        return;
      }

      room.push(socket.id);
      usersMap.set(channelId, room);
    } else {
      usersMap.set(channelId, [socket.id]);
    }

    socketToRoomMap.set(socket.id, channelId);

    const calleesInThisChannel = usersMap.get(channelId).filter(
      (id) => id !== socket.id,
    );

    socket.emit(CHANNEL.EXISTED_CALLEES, calleesInThisChannel);
  });
});

const handleOnCallerToCallee = chain(({ socket }) => {
  socket.on(CHANNEL.OFFER, ({ callerId, calleeId, signal }) => {
    socket.to(calleeId).emit(CHANNEL.USER_JOIN, {
      signal,
      callerId,
    });
  });
});

const handleOnCalleeToCaller = chain(({ socket }) => {
  socket.on(CHANNEL.ANSWER, (payload) => {
    socket.to(payload.callerId).emit(CHANNEL.RETURN_SIGNAL, {
      signal: payload.signal,
      id: socket.id,
    });
  });
});

const handleOnDisconnection = chain(({ socket }) => {
  socket.on("disconnect", () => {
    const channelId = socketToRoomMap.get(socket.id);
    const room = usersMap.get(channelId);

    if (!room) {
      return;
    }

    usersMap.set(channelId, room.filter((id) => id !== socket.id));

    socket.to(channelId).emit(CHANNEL.USER_DISCONNECT, socket.id);

    logger.info(`user(${socket.id}}) disconnected ${usersMap.get(channelId)?.length}명 남음`);
    logger.info(`${socket.id}가 ${channelId}방을 퇴장 하였습니다.
    ${usersMap.get(channelId)?.length || 0}명 남음
    `);
  });
});

module.exports = {
  handleOnJoinRoom,
  handleOnCallerToCallee,
  handleOnCalleeToCaller,
  handleOnDisconnection,
};
