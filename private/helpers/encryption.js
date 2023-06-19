/* eslint-disable no-underscore-dangle */

const crypto = require("crypto");

const iv = crypto.randomBytes(16);

// Derive a 32-byte buffer using SHA-256 hash function
const derivedBuffer = crypto
  .createHash("sha256")
  .update(process.env._SECRET_KEY)
  .digest();

function encryptData(data) {
  const cipher = crypto.createCipheriv("aes-256-cbc", derivedBuffer, iv);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}

function decryptData(encryptedData) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", derivedBuffer, iv);
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

module.exports = {
  encryptData,
  decryptData,
};
