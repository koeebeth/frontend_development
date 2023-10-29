const express = require("express");
const router = express.Router();

const axios = require("axios");

const createBackendUrl = require("../utils");

const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.post("/search", async (req, res) => {
  let data = {};

  if (req.body.name && typeof req.body.name === "string") {
    data.name = req.body.name;
  }

  if (req.body.sort || typeof req.body.search === "string") {
    data.sort = req.body.sort;
  }

  if (req.body.date || typeof req.body.date === "string") {
    data.date = req.body.date;
  }

  let searchArray = data.name.split(" ");

  console.log(searchArray);

  let name = searchArray.join("");

  data.name = name;

  let url = await createBackendUrl(`/api/v1/search`);
  let token = req.headers.authorization;

  let response = await axios.post(
    url,
    { data },
    { headers: { Authorization: token } }
  );

  if (response) {
    return res.status(200).send({
      message: "Results found",
      results,
    });
  }
});

module.exports = router;
