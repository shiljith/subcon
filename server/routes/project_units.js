const express = require("express");
const db = require("../config/db.config");

const router = express.Router();

router.post("/", (req, res, next) => {
  console.log(req.body);
  db.run(
    `INSERT INTO project_units 
    (
      unitId, unitNumber, modelName, startDate, endDate, days, budgetTMH, budgetHMH, actualTMH, actualHMH,
      unitValue, adminCost, estimatedCost, estimatedProfit, actualCost, actualProfit,  status, 
      description, updatedBy, createdBy, projectId, technicianSalary, helperSalary
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    Object.values(req.body),
    (error) => {
      if (error) {
        return res
          .status(404)
          .json({ success: false, data: null, error: error.message });
      }
      return res.send({ success: true });
    }
  );
});

router.get("/units", (req, res) => {
  console.log(req.params.projectId);
  const query = `SELECT * FROM units`;
  db.all(query, (error, result) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    return res.json({ success: true, data: result });
  });
});

router.get("/details/:unitId", (req, res) => {
  const query = `SELECT pu.*, cu.firstName || ' ' || cu.lastName as createdBy, uu.firstName || ' ' || uu.lastName as updatedBy, u.name as unitIdName
  FROM project_units as pu
  LEFT JOIN users as cu ON pu.createdBy = cu.id
  LEFT JOIN users as uu ON pu.updatedBy = uu.id
  LEFT JOIN units as u ON pu.unitId = u.id
  WHERE pu.id=${req.params.unitId}
  `;
  console.log(query);
  db.get(query, (error, result) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    return res.json({ success: true, data: result });
  });
});

router.get("/:projectId/:filter", (req, res) => {
  console.log("Params", req.params);
  let query = `SELECT pu.*, cu.firstName || ' ' || cu.lastName as createdBy, uu.firstName || ' ' || uu.lastName as updatedBy, u.name as unitIdName
  FROM project_units as pu
  LEFT JOIN users as cu ON pu.createdBy = cu.id
  LEFT JOIN users as uu ON pu.updatedBy = uu.id
  LEFT JOIN units as u ON pu.unitId = u.id
  WHERE pu.projectId=${req.params.projectId}`;
  if (req.params.filter && req.params.filter > 0) {
    query += ` AND unitId = ${req.params.filter}`;
  }
  query += ` ORDER BY pu.updatedAt DESC`;
  console.log(query);
  db.all(query, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(404).json({ success: false, data: null, error: error });
    }
    console.log("UNIT", result);
    return res.json({ success: true, data: result });
  });
});

router.delete("/:id", (req, res, next) => {
  db.run(
    `DELETE FROM project_units WHERE id=${req.params.id}`,
    (error, result, fields) => {
      if (error) {
        return res
          .status(404)
          .json({ success: false, data: null, error: error });
      }
      return res.send({ success: true, data: result });
    }
  );
});

router.patch("/:id", (req, res) => {
  console.log(req.body);
  db.run(
    `UPDATE project_units SET 
    unitId = ?, unitNumber = ?, modelName = ?, startDate = ?, endDate = ?, days = ?,
    budgetTMH = ?, budgetHMH = ?, actualTMH = ?, actualHMH = ?, unitValue = ?, adminCost = ?, 
    estimatedCost = ?, estimatedProfit = ?, actualCost = ?, actualProfit = ?, status = ?,
    description = ?, updatedBy= ? WHERE id=${req.params.id}`,
    Object.values(req.body),
    (error, result) => {
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
