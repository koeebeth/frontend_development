const express = require("express");

const router = express.Router();
const { User } = require("../models");
const { Op } = require("sequelize");
const crypto = require("crypto");
const otplib = require("otplib");
const fs = require("fs-extra");

const isAuthenticated = require("../middlewares/auth");

router.use(isAuthenticated.unless({ path: [/.*\/login/, /.*\/register/] }));

router.post("/login", (req, res) => {
  const generic_error_message = {
    error: true,
    message: "Please check again your username or password",
  };

  if (!req.body.username || typeof req.body.username !== "string") {
    return res.status(400).send({
      error: true,
      message: "Username missing or empty",
    });
  }
  if (!req.body.password || typeof req.body.password !== "string") {
    return res.status(400).send({
      error: true,
      message: "Password missing or empty",
    });
  }

  User.findOne({
    where: {
      username: req.body.username.trim(),
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          error: true,
          message: "User not found",
        });
      }
      let salt = user.salt;
      let hash = crypto
        .pbkdf2Sync(user.password, salt, 1000, 64, "sha512")
        .toString("hex");

      if (
        crypto.timingSafeEqual(
          Buffer.from(hash),
          Buffer.from(user.password)
        ) !== true
      ) {
        return res.send(generic_error_message);
      }
      let session_body = {
        username: data.username,
        role: data.role,
        id: data.id,
        verified: data.verified,
      };
      res.send({
        access_token: jwt.sign(session_body, config["JWT_SECRET"], {
          algorithm: "HS256",
          expiresIn: config["JWT_EXPIRY"],
        }),
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        error: true,
        message: "Internal error.",
      });
    });
});

router.post("/register", (req, res) => {
  if (!req.body.username || typeof req.body.username !== "string") {
    return res.status(400).send({
      error: true,
      message: "Username missing or empty",
    });
  }
  if (!req.body.password || typeof req.body.password !== "string") {
    return res.status(400).send({
      error: true,
      message: "Password missing or empty",
    });
  }

  if (req.body.password.length < 8) {
    return res.status(400).send({
      error: true,
      message: "Password length must be greater than 8 characters !",
    });
  }
  if (req.body.password.length > 100) {
    return res.status(400).send({
      error: true,
      message: "Password length must be lower than 100 characters !",
    });
  }

  User.findAll({
    where: {
      username: req.body.username,
    },
  })
    .then((data) => {
      if (data.length === 0) {
        let salt = crypto.randomBytes(64).toString("hex");
        let mfa = otplib.authenticator.generateSecret();
        const user = User.build({
          username: req.body.username,
          password: crypto
            .pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512")
            .toString("hex"),
          salt: salt,
          mfa_secret: mfa,
          verified: false,
          role: "user",
        });
        user
          .save()
          .then((user) => {
            res.send(user.id);
          })
          .catch((err) => {
            if (err)
              return res.status(500).send({
                error: true,
                message: "Internal Error",
              });
          });
      } else {
        return res.status(400).send({
          error: true,
          message: "Username has already used !",
        });
      }
    })
    .catch((err) => {
      if (err)
        return res.status(500).send({
          error: true,
          message: "Internal Error",
        });
    });
});

router.post("/changePassword", (req, res) => {
  const generic_error_message = {
    error: true,
    message: "Please check again your username or password",
  };

  if (!req.body.password || typeof req.body.password !== "string") {
    return res.status(400).send({
      error: true,
      message: "Password missing or empty",
    });
  }
  if (!req.body.repassword && typeof req.body.repassword !== "string") {
    return res.status(400).send({
      error: true,
      message: "Repassword missing or empty",
    });
  }

  if (req.body.password.length < 8) {
    return res.status(400).send({
      error: true,
      message: "Password length must be greater than 8 characters !",
    });
  }
  if (req.body.password.length > 100) {
    return res.status(400).send({
      error: true,
      message: "Password length must be lower than 100 characters !",
    });
  }

  if (req.body.new_password.length < 8) {
    return res.status(400).send({
      error: true,
      message: "Password length must be greater than 8 characters !",
    });
  }
  if (req.body.new_password.length > 100) {
    return res.status(400).send({
      error: true,
      message: "Password length must be lower than 100 characters !",
    });
  }

  if (req.body.new_password.confirmation.length < 8) {
    return res.status(400).send({
      error: true,
      message: "Password length must be greater than 8 characters !",
    });
  }
  if (req.body.new_password.confirmation.length > 100) {
    return res.status(400).send({
      error: true,
      message: "Password length must be lower than 100 characters !",
    });
  }

  User.findByPk(req.user.id).then((data) => {
    if (!data) {
      res.send(generic_error_message);
    }

    if (req.body.new_password !== req.body.new_password.confirmation) {
      return res.status(400).send({
        error: true,
        message: "New password and New password confirmation not equal",
      });
    }
    let salt = data.salt;
    let hash = crypto
      .pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512")
      .toString("hex");

    if (
      crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(data.password)) !==
      true
    ) {
      return res.send(generic_error_message);
    }

    let new_password = crypto
      .pbkdf2Sync(req.body.new_password, salt, 1000, 64, "sha512")
      .toString("hex");

    data.update({ password: new_password }).then(() => {
      return res.send({
        message: "Password successfully changed",
      });
    });
  });
});

router.get("/profile", async function (req, res, next) {
  let user = await User.findByPk(req.user.id);
  res.send({
    id: user.id,
    username: user.username,
    mfa_secret: otplib.authenticator.keyuri(
      user.username,
      "Syndore",
      user.mfa_secret
    ),
    role: user.role,
    verified: user.verified,
  });
});

router.get("/logout", function (req, res, next) {
  res.send(req.user);
});

module.exports = router;

// router.post("/resetPassword", (req, res) => {
//   if (!req.body.email || typeof req.body.email === "string") {
//     return res.status(400).send({
//       error: true,
//       message: "Repassword missing or empty",
//     });
//   }

//   User.findOne({
//     where: {
//       email: req.body.email,
//     },
//   }).then((user) => {
//     return res.status(201).send({
//       message: "Email reset sended",
//     });
//   });
// });
