const config = require("../config/config");
var { expressjwt: jwt } = require("express-jwt");

const db = require("../models/index");

const User = db.User;

const isValidToken = async (req, token, next) => {
  const user = await User.findByPk(token.id);
  next(user === null);
};

var middleware = jwt({
  secret: config["JWT_TOKEN_SECRET"],
  algorithms: ["HS256"],
  isRevoked: isValidToken,
});

module.exports = middleware;
