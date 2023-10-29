const express = require("express");

const router = express.Router();

const userRouter = require("./users");
const fileRouter = require("./files");
const shareRouter = require("./users");
const downloadRouter = require("./users");
const searchRouter = require("./search");

// router.use("/", downloadRouter);
// router.use("/shares", shareRouter);
// router.use("/files", fileRouter);
router.use("/auth", userRouter);
router.use("/search", searchRouter);

module.exports = router;
