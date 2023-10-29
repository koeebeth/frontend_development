const config = require("./config/config");
const path = require("path");

const createBackendURL = async (uri, query = "") => {
  const host = process.env.BACKEND_HOST || "backend";
  const port = process.env.BACKEND_PORT || "3000";

  return `http://${host}:${port}${path.normalize("/" + uri)}?${query}`;
};

module.exports = createBackendURL;
