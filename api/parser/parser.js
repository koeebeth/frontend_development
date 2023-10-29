const Promise = require("bluebird");
const mysql2 = require("mysql2");

const config = require("../config/config");

const queryParser = async (query, params, options = {}) => {
  

  try {
    const conn = mysql2.createConnection({
      host: config["DATABASE_HOST"],
      user: config["DATABASE_USER"],
      database: config["DATABASE_NAME"],
    });

    if (conn) {
      conn.query(query, (err, results, fields) => {
        return new Promise((resolve, reject) => {
          if (err) reject(err);
          console.log(results);
          console.log(fields);

          resolve(results);
        });

      });
    }
  } catch (error) {
    if (err)
      return res.status(400).send({
        error: true,
        message: "Something went wrong",
      });
  }
};

module.exports = queryParser;
