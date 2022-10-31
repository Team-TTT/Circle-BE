const mongoose = require('mongoose');
const logger = require('../libs/logger');

module.exports = {
  testDbConnecting: async (DB_URI) => {
    await mongoose.disconnect();
    await mongoose.connect(DB_URI);
    logger.info("Test database is connected");
  },

  postLoginAndGetCookie: async (server) => {
    const googleUserInfo = {
      displayName: process.env.DISPLAY_NAME,
      email: process.env.EMAIL,
      photoUrl: process.env.PHOTO_URL,
      uid: process.env.UID,
    };

    const token = process.env.TOKEN;

    const response = await server
      .post("/auth/users")
      .send(googleUserInfo)
      .set("Authorization", `Bearer ${token}`)
      .expect("set-cookie", /session/)
      .expect(200);

    return response;
  },
};
