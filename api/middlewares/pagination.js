const parser = require("../parser/parser");

const pagination = async (req, res, next) => {
  if (
    !req.query.page ||
    typeof req.query.page !== "number" ||
    req.query.page <= 0
  ) {
    return res.status(400).send({
      error: true,
      message: "Page parameter missing or empty !",
    });
  }
  let page = req.query.page || 1;
  let per_page = 5;
  let offset = (page - 1) * per_page;
  let query = `SELECT * from users LIMIT ${per_page} OFFSET ${offset}`;

  let results = await parser(query);

  return res.status(200).send({
    results,
  });
};
