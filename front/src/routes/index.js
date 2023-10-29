const express = require("express");

const router = express.Router();

const userRouter = require("./users");

router.use("/auth", userRouter);

module.exports = router;
