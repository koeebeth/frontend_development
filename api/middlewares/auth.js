const config = require("../config/config");
var { expressjwt: jwt } = require("express-jwt");


var middleware = jwt({
  secret: config["JWT_TOKEN_SECRET"],
  algorithms: ["HS256"],
});

module.exports = middleware;
