const express = require("express");
const db = require("../config/db.config");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {
  db.get(
    `
    SELECT name, address, technicianSalary, helperSalary, paymentStatus FROM accounts WHERE id = ${req.payload.accountId}
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

router.patch("/", auth, (req, res) => {
  db.run(
    `UPDATE accounts SET name = ?, address = ?, technicianSalary = ?, helperSalary = ? WHERE id=${req.payload.accountId}`,
    Object.values(req.body),
    (error, result) => {
      console.log(error);
      if (error) {
        return res
          .status(404)
          .json({ success: false, data: null, error: error });
      }
      return res.send({ success: true, data: result });
    }
  );
});

module.exports = router;
