const crypto = require("node:crypto");

const mySecret = process.env.SECRET_KEY;

const generateSecretDbKey = () => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  return {
    iv: iv.toString("hex"),
    key: key.toString("hex"),
  };
};

const getUserSecret = (secretDbKey) => {
  const { iv: stringIv, key: stringKey } = secretDbKey;
  const iv = Buffer.from(stringIv, "hex");
  const key = Buffer.from(stringKey, "hex");
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  const encrypted = cipher.update(mySecret);
  const encryptedData = Buffer.concat([encrypted, cipher.final()]);
  const encodedData = encryptedData.toString("hex");

  return encodedData;
};

const validateSecretKey = (secretUserKey, secreteDbKey) => {
  const { iv: stringIv, key: stringKey } = secreteDbKey;
  const encodedData = secretUserKey;
  const iv = Buffer.from(stringIv, "hex");
  const key = Buffer.from(stringKey, "hex");
  const encrypted = Buffer.from(encodedData, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );

  const decrypted = decipher.update(encrypted);
  const data = Buffer.concat([decrypted, decipher.final()]);
  const decodedData = data.toString();

  return decodedData === process.env.SECRET_KEY;
};

module.exports = {
  generateSecretDbKey,
  validateSecretKey,
  getUserSecret,
};
