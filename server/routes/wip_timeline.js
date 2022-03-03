const express = require("express");
const db = require("../config/db.config");

const router = express.Router();

router.post("/", (req, res, next) => {
  console.log(req.body);
  db.run(
    `INSERT INTO project_unit_wip_timeline
    (wipId, action, description, icon, createdBy)
    VALUES (?, ?, ?, ?, ?)`,
    Object.values(req.body),
    (error, result) => {
      console.log(error, result);
      if (error) {
        return res
          .status(404)
          .json({ success: false, data: null, error: error });
      }
      return res.send({ success: true });
    }
  );
});

router.get("/:wipId", (req, res) => {
  db.all(
    `
    SELECT puwt.description, puwt.action, puwt.icon, puwt.createdAt, u.firstName || ' ' || u.lastName as createdBy FROM project_unit_wip_timeline as puwt
    JOIN users as u ON u.id =  puwt.createdBy
    WHERE wipId=${req.params.wipId}
    ORDER BY puwt.createdAt DESC
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

module.exports = router;
