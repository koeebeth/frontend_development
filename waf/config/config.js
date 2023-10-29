const process = require("process");
const crypto = require("crypto");

const config = {
  JWT_TOKEN_SECRET: crypto.randomBytes(64).toString("hex"),
  JWT_EXPIRY: process.env.JWT_EXPIRY || "12h",
  DATABASE_NAME: process.env.DB_NAME || "syndore",
  DATABASE_USER: process.env.DB_USER || "root",
  DATABASE_PASS: process.env.DB_PASS || "Tr1234567",
  DATABASE_HOST: process.env.DB_HOST || "localhost",
  TMP_DIRECTORY: process.cwd() + "/tmp",
  MEDIA_DIRECTORY: process.cwd() + "/media",
  BACKEND_HOST: process.env.BACKEND_HOST,
  BACKEND_PORT: process.env.BACKEND_PORT,
  DEBUG: false,
};

module.exports = config;
