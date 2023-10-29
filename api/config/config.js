const process = require("process");
const crypto = require("crypto");

const config = {
  JWT_TOKEN_SECRET: crypto.randomBytes(64).toString("hex"),
  DATABASE_NAME: process.env.DB_NAME || "syndore",
  DATABASE_USER: process.env.DB_USER || "root",
  DATABASE_PASS: process.env.DB_PASS || "Tr1234567",
  DATABASE_HOST: process.env.DB_HOST || "localhost",
  ROOT_DIRECTORY: process.cwd(),
  TMP_DIRECTORY: process.cwd() + "/tmp",
  MEDIA_DIRECTORY: process.cwd() + "/media",
};

module.exports = config;
