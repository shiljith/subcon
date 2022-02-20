const express = require("express");
const db = require("../config/db.config");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/project-count", auth, (req, res) => {
  const query = `
    SELECT COUNT(*) as projectCount FROM projects
     WHERE accountId = ${req.payload.accountId}
  `;
  db.get(query, (error, result, fields) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  });
});

router.get("/total-work-value", auth, (req, res) => {
  const query = `
    SELECT SUM(pu.estimatedAmount) as totalWorkValue FROM project_units as pu
    JOIN  projects as p ON p.id = pu.projectId WHERE p.accountId = ${req.payload.accountId} 
  `;
  db.get(query, (error, result, fields) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  });
});

router.get("/total-billed", auth, (req, res) => {
  const query = `
    SELECT SUM(puw.amount) as totalBilled FROM project_unit_wip as puw
    JOIN project_units as pu ON pu.id = puw.projectUnitId
    JOIN projects as p ON p.id = pu.projectId
    WHERE p.accountId =  ${req.payload.accountId} 
  `;
  db.get(query, (error, result, fields) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  });
});

router.get("/balance-work-value", auth, (req, res) => {
  const query = `
    SELECT (pu.estimatedAmount - SUM(puw.amount)) as balanceWorkValue FROM project_unit_wip as puw
    JOIN project_units as pu ON pu.id = puw.projectUnitId
    JOIN projects as p ON p.id = pu.projectId 
    WHERE p.accountId = ${req.payload.accountId} GROUP BY pu.id   
  `;
  db.all(query, (error, result, fields) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    if (result) {
      console.log("BALACE", result);
      return res.json({ success: true, data: result });
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  });
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

router.get("/project-status", auth, (req, res) => {
  const projectStatus = {
    labels: ["In Progress", "On Hold", "Completed"],
    datasets: [
      {
        data: [3, 2],
      },
    ],
  };

  const query = `
    SELECT COUNT(*) as inProgress from projects
    WHERE accountId = ${req.payload.accountId} AND status = 3  
  `;
  db.get(query, (error, result, fields) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    if (result) {
      console.log("PSTATUS", result);
      projectStatus.datasets[0].data.push(result.inProgress);
      return res.json({ success: true, data: projectStatus });
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  });
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
