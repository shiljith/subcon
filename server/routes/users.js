const express = require("express");
const db = require("../config/db.config");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res, next) => {
  const user = { ...req.body, accountId: req.payload.accountId };
  db.get(
    `SELECT COUNT(*) as isUsernameExist FROM users WHERE username = '${user.username}'`,
    (error, result) => {
      console.log("WERTY", error, result);
      if (error) {
        return res
          .status(404)
          .json({ success: false, data: null, error: error });
      }
      if (result) {
        if (result.isUsernameExist === 0) {
          db.run(
            `INSERT INTO users (firstName, lastName, role, username, password, accountId) VALUES(?, ?, ?, ?, ?, ?)`,
            Object.values(user),
            (error, result, fields) => {
              if (error) {
                console.log(error);
                return res
                  .status(404)
                  .json({ success: false, data: null, error: error });
              }
              return res.send({ success: true, data: result });
            }
          );
        } else {
          return res.status(404).json({
            success: false,
            data: null,
            error: {
              message:
                "Username is already taken in this application. Please create user with another one.",
            },
          });
        }
      }
    }
  );
});

router.get("/", auth, (req, res) => {
  db.all(
    `
    SELECT u.id, u.firstName, u.lastName, r.name as role, u.username FROM users as u
    JOIN roles as r ON r.id = u.role
    WHERE u.accountId = ${req.payload.accountId} AND
    role != 1
    ORDER BY u.createdAt DESC
    `,
    (error, result, fields) => {
      if (error) {
        console.log(error);
        return res
          .status(404)
          .json({ success: false, data: null, error: error });
      }
      return res.json({ success: true, data: result });
    }
  );
});

router.put("/", (req, res, next) => {
  db.query(
    `UPDATE users SET ? WHERE id=${req.params.id}`,
    { ...req.body },
    (error, result, fields) => {
      if (error) {
        console.log(error);
        return res
          .status(404)
          .json({ success: false, data: null, error: error });
      }
      return res.send({ success: true, data: result });
    }
  );
});

router.delete("/:id", (req, res, next) => {
  db.run(
    `DELETE FROM users WHERE id=${req.params.id}`,
    (error, result, fields) => {
      if (error) {
        console.log(error);
        return res
          .status(404)
          .json({ success: false, data: null, error: error });
      }
      return res.send({ success: true, data: result });
    }
  );
});

router.post("/login", (req, res, next) => {
  const query = `SELECT * FROM users WHERE username='${req.body.username}' AND password='${req.body.password}' LIMIT 1`;
  console.log(query);
  db.get(query, (error, result) => {
    console.log("Login", error, result);
    if (error) {
      console.log(error);
      return res
        .status(404)
        .json({ success: false, data: null, error: error.message });
    }
    if (result) {
      console.log("USER", config.TOKEN_SECRET);
      const token = jwt.sign(
        {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          accountId: result.accountId,
          username: result.username,
          role: result.role,
        },
        config.TOKEN_SECRET
      );

      return res.send({ success: true, data: { token } });
    } else {
      return res.status(403).json({
        success: false,
        data: null,
        message: "Invalid username or password",
      });
    }
  });
});

module.exports = router;
