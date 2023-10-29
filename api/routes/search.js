const express = require("express");
const parser = require("../parser/parser");

const router = express.Router();

const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.post("/search", async (req, res) => {
  try {
    if (!req.body.data || typeof req.body.data !== "object") {
      return res.status(400).send({
        error: true,
        message: "Data parameter is missing or empty",
      });
    }

    let data = req.body.data;
    let params = {
      name: `LIKE '%${data.username}%'`,
      sort: `ORDER BY ${data.sort} ${data.username}`,
      date: `ORDER BY ${data.date}`,
    };

    if (data.sort && data.date) {
      delete params[sort];
      delete params[date];

      params[
        sortWithDate
      ] = `ORDER BY ${data.sort} ${data.username},${data.date}`;
    }

    let query = `SELECT * from users WHERE username LIKE '%${req.body.search}%' OR email LIKE '%${req.body.search}%'`;

    // date ve sort a göre arama olacak !!
    let results = await parser(query);
    return results;
  } catch (error) {
    if (err) throw new Error("Something went wrong !");
  }
});

module.exports = router;
