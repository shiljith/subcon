const express = require("express");
const db = require("../config/db.config");

const router = express.Router();

router.post("/", (req, res, next) => {
  console.log(req.body);
  db.run(
    `INSERT INTO users (fullName, username, password, role) VALUES(?, ?, ?, ?)`,
    Object.values(req.body),
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

router.get("/", (req, res) => {
  db.all(
    `
    SELECT * FROM users
    WHERE role != 1
    ORDER BY createdAt DESC
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
  db.get(
    `SELECT * FROM users WHERE username='${req.body.username}' AND password='${req.body.password}' LIMIT 1`,
    (error, result) => {
      if (error) {
        console.log(error);
      }
      console.log(result);

      return res.send({ success: true, data: result });
    }
  );
});

module.exports = router;
