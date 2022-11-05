const mongoose = require('mongoose');
const logger = require('../libs/logger');

module.exports = {
  testDbConnect: async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGODB_TEST, { dbName: process.env.MONGODB_TEST_DB_NAME });
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
