const express = require("express");
const db = require("../config/db.config");

const router = express.Router();

router.post("/", (req, res, next) => {
  db.run(
    `
      INSERT INTO projects 
      (poNumber, name, status, description, contractor, updatedBy, createdBy) 
      VALUES (?,?,?,?,?,?,?)
    `,
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

router.get("/", (req, res) => {
  db.all(
    `
      SELECT p.*, cu.fullName as createdBy, uu.fullName as updatedBy
      FROM projects as p 
      LEFT JOIN users as cu ON p.createdBy = cu.id
      LEFT JOIN users as uu ON p.updatedBy = uu.id
      ORDER BY p.updatedAt DESC
    `,
    (error, result, fields) => {
      if (error) {
        return res
          .status(404)
          .json({ success: false, data: null, error: error });
      }
      return res.json({ success: true, data: result });
    }
  );
});

router.post("/filter", (req, res) => {
  console.log(req.body);
  const searchTerm = req.body.search;
  const status = Number(req.body.status);
  let query = `
    SELECT * FROM projects
    WHERE (name LIKE '%${searchTerm}%' OR poNumber LIKE '%${searchTerm}%'
    OR description LIKE '%${searchTerm}%' OR contractor LIKE '%${searchTerm}%')`;
  if (status !== 0) {
    query += ` AND status = ${status}`;
  }
  query += ` ORDER BY updatedAt DESC`;
  db.all(query, (error, result, fields) => {
    if (error) {
      return res
        .status(404)
        .json({ success: false, data: null, error: error.message });
    }
    return res.json({ success: true, data: result });
  });
});

router.get("/:id", (req, res, next) => {
  db.get(
    `
      SELECT p.*, cu.fullName as createdBy, uu.fullName as updatedBy
      FROM projects as p 
      LEFT JOIN users as cu ON p.createdBy = cu.id
      LEFT JOIN users as uu ON p.updatedBy = uu.id
      WHERE p.id=${req.params.id}
    `,
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

router.patch("/:id", (req, res) => {
  console.log("HI", req.body);
  db.run(
    `UPDATE projects SET poNumber = ?, name = ?, status = ?, description = ?, contractor = ?, updatedBy= ? WHERE id=${req.params.id}`,
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

router.delete("/:id", (req, res, next) => {
  db.run(
    `DELETE FROM projects WHERE id=${req.params.id}`,
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

module.exports = router;
