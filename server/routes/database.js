const express = require("express");
const db = require("../config/db.config");

const router = express.Router();

const tables = [
  "roles",
  "units",
  "users",
  "projects",
  "project_units",
  "project_unit_wip",
];

router.delete("/drop", (req, res, next) => {
  tables.forEach((table) => {
    const SQL = `DROP TABLE ${table};`;
    db.run(SQL, (err) => {
      if (err) {
        return console.log("DB FLUSH ERROR", err.message);
      }
      console.log(`${table} table dropped.`);
    });
  });
});

router.post("/insert", (req, res) => {
  const query = `INSERT INTO ${req.body.tableName} ${req.body.columns} VALUES ${req.body.values}`;
  console.log(query);
  db.run(query, (err) => {
    if (err) {
      return console.log("DATA INSERT ERROR", err.message);
    }
    console.log(`Data inserted successfully.`);
  });
});

module.exports = router;
