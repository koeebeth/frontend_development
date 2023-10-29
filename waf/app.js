const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const schedule = require("node-schedule");

const app = express();
const apiRouter = require("./routes/index");
const db = require("./models/index");

db.sequelize.sync().then(function () {
  console.log("Database creating");
});

app.use(cors());
app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded(false));
app.use(cookieParser());

app.use("/", apiRouter);

const User = db.User;

schedule.scheduleJob("0 5 * * *", async function () {
  await User.destroy({
    verified: false,
  });
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    if (err.code == "revoked_token") {
      return res.status(err.status).send({
        error: true,
        message: err.message,
        deleteAccount: true,
      });
    } else {
      return res.status(err.status).send({
        error: true,
        message: err.message,
      });
    }
  }
  return res.status(500).send({
    error: true,
    message: "Something went wrong !",
  });
});

module.exports = app;
