const express = require("express");
const db = require("../config/db.config");

const router = express.Router();

router.post("/", (req, res, next) => {
  console.log(req.body);
  db.run(
    `INSERT INTO project_unit_wip
    (percentage, amount, comments, projectUnitId, createdBy,updatedBy)
    VALUES (?, ?, ?, ?, ?, ?)`,
    Object.values(req.body),
    (error) => {
      if (error) {
        console.log(error);
        return res
          .status(404)
          .json({ success: false, data: null, error: error });
      }
      return res.send({ success: true });
    }
  );
});

router.get("/:unitId", (req, res) => {
  db.all(
    `
    SELECT w.*, uu.firstName || ' ' || uu.lastName as updatedBy
    FROM project_unit_wip as w 
    LEFT JOIN users as uu ON w.updatedBy = uu.id
    WHERE projectUnitId=${req.params.unitId}
    ORDER BY w.createdAt ASC
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

router.patch("/:id", (req, res) => {
  console.log(req.body);
  db.run(
    `UPDATE project_unit_wip SET percentage = ?, amount = ?, comments = ?, updatedBy = ? WHERE id=${req.params.id}`,
    Object.values(req.body),
    (error, result) => {
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
    `DELETE FROM project_unit_wip WHERE id=${req.params.id}`,
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

module.exports = router;
