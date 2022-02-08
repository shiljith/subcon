const express = require("express");
const db = require("../config/db.config");

const router = express.Router();

router.get("/tile-values", (req, res) => {
  return res.json({
    success: true,
    data: {
      totalWorkValue: 25000,
      totalBilledAsOnDate: 15000,
      balanceWorkValue: 10000,
      totalEscalatorCount: 200,
      totalTravellatorCount: 277,
      totalElivatorCount: 23,
    },
  });
  db.all(
    `
      SELECT COUNT(unitId) as totalWorkValue FROM project_units as pu 
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

router.get("/month-wise-work-value", (req, res) => {
  return res.json({
    success: true,
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "Augest",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          data: [10, 15, 23, 12, 66, 43, 78, 10, 44, 33, 45, 15],
          label: "Work Value",
        },
      ],
    },
  });
  db.all(
    `
      SELECT COUNT(unitId) as totalWorkValue FROM project_units as pu 
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

router.get("/project-status", (req, res) => {
  return res.json({
    success: true,
    data: {
      labels: ["In Progress", "On Hold", "Completed"],
      datasets: [
        {
          data: [300, 500, 100],
        },
      ],
    },
  });
  db.all(
    `
      SELECT COUNT(unitId) as totalWorkValue FROM project_units as pu 
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

router.get("/man-hour", (req, res) => {
  return res.json({
    success: true,
    data: {
      estimated: {
        technician: 8,
        helper: 22,
      },
      actual: {
        technician: 13,
        helper: 32,
      },
    },
  });
  db.all(
    `
      SELECT COUNT(unitId) as totalWorkValue FROM project_units as pu 
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

module.exports = router;
