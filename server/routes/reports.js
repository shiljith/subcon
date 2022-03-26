const express = require("express");
const db = require("../config/db.config");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/get-contractors", auth, (req, res, next) => {
  db.all(
    `
      SELECT DISTINCT contractor as name  FROM projects
      WHERE accountId=${req.payload.accountId}
    `,
    (error, result) => {
      if (error) {
        return res
          .status(404)
          .json({ success: false, data: null, error: error });
      }
      if (result) {
        return res.send({ success: true, data: result });
      } else {
        return res.status(404).send("Main contractor not found.");
      }
    }
  );
});

router.get("/get-projects", auth, (req, res, next) => {
  let query = `
    SELECT name FROM projects
  `;
  if (req.query.filter && req.query.filter !== "") {
    query += ` WHERE contractor IN ${req.query.filter} AND accountId=${req.payload.accountId}`;
  } else {
    query += ` WHERE accountId=${req.payload.accountId}`;
  }
  db.all(query, (error, result) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    if (result) {
      return res.send({ success: true, data: result });
    } else {
      return res.status(404).send("Project not found.");
    }
  });
});

router.get("/get-project-units", auth, (req, res, next) => {
  let query = `
    SELECT DISTINCT u.id, u.name as name FROM units as u
    JOIN project_units as pu ON u.id = pu.unitId
    JOIN projects as p ON p.id = pu.projectId
    WHERE`;

  if (req.query.mainContractor && req.query.mainContractor !== "") {
    query += ` p.contractor IN ${req.query.mainContractor} AND`;
  }

  if (req.query.projectName && req.query.projectName !== "") {
    query += ` p.name IN ${req.query.projectName} AND`;
  }

  query += ` p.accountId=${req.payload.accountId}`;

  db.all(query, (error, result) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    if (result) {
      return res.send({ success: true, data: result });
    } else {
      return res.status(404).send("Project not found.");
    }
  });
});

router.get("/get-unit-numbers", auth, (req, res, next) => {
  let query = `
    SELECT unitNumber as name FROM project_units as pu
    JOIN projects as p ON p.id = pu.projectId
    JOIN units as u ON u.id = pu.unitId
    WHERE`;

  if (req.query.mainContractor && req.query.mainContractor !== "") {
    query += ` p.contractor IN ${req.query.mainContractor} AND`;
  }

  if (req.query.projectName && req.query.projectName !== "") {
    query += ` p.name IN ${req.query.projectName} AND`;
  }

  if (req.query.projectUnit && req.query.projectUnit !== "") {
    query += ` u.name IN ${req.query.projectUnit} AND`;
  }

  query += ` p.accountId=${req.payload.accountId}`;
  db.all(query, (error, result) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    if (result) {
      return res.send({ success: true, data: result });
    } else {
      return res.status(404).send("Project not found.");
    }
  });
});

router.get("/wip-report", auth, (req, res) => {
  const startDate = null;
  const endDate = null;
  const param = req.query;

  let query = `
    SELECT 
      contractor, p.name, poNumber, unitId, unitValue, totalWIP, 
      unitValue*(cast(totalWIP as DOUBLE))/100 as totalBilledValue,
        100-cast(totalWIP as DOUBLE) as balance,
        unitValue-(unitValue*(cast(totalWIP as DOUBLE))/100) as balanceUnitValue, pu.status,
        strftime('%d/%m/%Y', pu.startDate) as startDate,strftime('%d/%m/%Y', pu.endDate) as endDate
    FROM projects as p
    INNER JOIN project_units pu ON p.id = pu.projectId
    INNER JOIN units as u ON u.id = pu.unitId
    INNER JOIN ( 
      SELECT projectUnitId, SUM(percentage) as totalWIP from  project_unit_wip WHERE status = 1
    ) as puw
    ON puw.projectUnitId = pu.projectId
    WHERE`;
  if (param.mainContractor && param.mainContractor !== "") {
    query += ` p.contractor IN ${param.mainContractor} AND`;
  }

  if (param.projectName && param.projectName !== "") {
    query += ` p.name IN ${param.projectName} AND`;
  }

  if (param.projectUnit && param.projectUnit !== "") {
    query += ` u.name IN ${param.projectUnit} AND`;
  }

  if (param.unitNumber && param.unitNumber !== "") {
    query += ` pu.unitNumber IN ${param.unitNumber} AND`;
  }

  if (
    param.startDate &&
    param.startDate !== "" &&
    param.endDate &&
    param.endDate !== ""
  ) {
    query += ` strftime('%m/%d/%Y', pu.startDate) >=  '${param.startDate}'
    AND strftime('%m/%d/%Y', pu.endDate) <= '${param.endDate}' AND`;
  }

  query += ` p.accountId = ${req.payload.accountId}`;
  console.log("WIP", query);
  db.all(query, (error, result) => {
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

router.get("/ipo-report", auth, (req, res) => {
  const params = req.query;
  let query = `
    SELECT 
      p.contractor, p.name, u.name as projectUnit, unitNumber, modelName, unitValue,
      strftime('%d/%m/%Y', pu.startDate) as startDate,strftime('%d/%m/%Y', pu.endDate) as endDate, 
      days, adminCost, budgetTMH, budgetHMH, actualTMH, actualHMH,
      estimatedCost, estimatedProfit, actualCost, actualProfit 
    FROM projects p
    INNER JOIN project_units pu ON p.id = pu.projectId
    INNER JOIN units u ON pu.unitId = u.id WHERE`;

  if (params.mainContractor && params.mainContractor !== "") {
    query += ` p.contractor IN ${params.mainContractor} AND`;
  }

  if (params.projectName && params.projectName !== "") {
    query += ` p.name IN ${params.projectName} AND`;
  }

  if (params.projectUnit && params.projectUnit !== "") {
    query += ` u.id IN ${params.projectUnit} AND`;
  }

  if (params.unitNumber && params.unitNumber !== "") {
    query += ` pu.unitNumber IN ${params.unitNumber} AND`;
  }

  if (
    params.startDate &&
    params.startDate !== "" &&
    params.endDate &&
    params.endDate !== ""
  ) {
    query += ` strftime('%m/%d/%Y', pu.startDate) >=  '${params.startDate}'
    AND strftime('%m/%d/%Y', pu.endDate) <= '${params.endDate}' AND`;
  }

  query += ` p.accountId = ${req.payload.accountId}`;
  db.all(query, (error, result) => {
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

module.exports = router;
