module.exports = {
  MESSAGE: {
    SUCCESS: "success",
    UNAUTHORIZED: "Unauthorized",
    INVALID_INPUT: "Invalid input",
    INVALID_EMAIL: "Please fill a valid email address",
    LIMITED_PROJECT: "The number of projects has reached the limit",
    LIMITED_CHANNEL: "The number of channels has reached the limit",
    BAD_REQUEST: "Bad request",
    INTERNAL_SERVER_ERROR: "Internal server error",
  },
  CHANNEL: {
    JOIN: "join",
    LEAVE: "leave",
    OFFER: "offer",
    ANSWER: "answer",
    EXISTED_CALLEES: "users",
    USER_JOIN: "user-join",
    RETURN_SIGNAL: "return-signal",
    USER_DISCONNECT: "disconnect-user",
  },
  LIMITED_PROJECT_COUNT: 3,
  LIMITED_CHANNEL_COUNT: 4,
  DEFAULT_COOKIE_DURATION: 60 * 60 * 24 * 1 * 1000,
};
