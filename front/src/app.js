const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const fs = require('fs');
const app = express();

const frontRouter = require("./routes/index");

app.use(helmet());
app.use(logger("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", frontRouter);

app.listen(81);
