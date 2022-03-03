const express = require("express");
const db = require("../config/db.config");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/wip-report", auth, (req, res) => {
  const startDate = null;
  const endDate = null;

  let query = `
    SELECT contractor, name, poNumber, unitId, unitValue, totalWIP, 
    unitValue*(cast(totalWIP as DOUBLE))/100 as  totalBilledValue, 
    100-cast(totalWIP as DOUBLE) as balance,
    unitValue-(unitValue*(cast(totalWIP as DOUBLE))/100) as balanceUnitValue,
    b.status
    from projects a
    inner join project_units b on a.id=b.projectId
    inner join ( SELECT projectUnitId,sum(percentage) as totalWIP from  project_unit_wip where status = 1 )C
        on c.projectUnitId =b.unitId
    where `;
  if (startDate && endDate) {
    query += `cast(b.startDate as datetime)>= cast( '${startDate}' as datetime) 
    and cast(b.endDate as datetime)  <=cast('${endDate}'  as datetime) and `;
  }

  query += `a.accountId = ${req.payload.accountId}`;
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

router.get("/ipo-report/:unit/:contractor/:name", auth, (req, res) => {
  console.log("PARAM", req.params);
  let query = `
    SELECT 
      p.contractor, p.name, u.name as projectUnit, unitNumber, modelName, unitValue,
      startDate, endDate, days, adminCost, budgetTMH, budgetHMH, actualTMH, actualHMH,
      estimatedCost, estimatedProfit, actualCost, actualProfit 
    FROM projects p
    INNER JOIN project_units pu ON p.id = pu.projectId
    INNER JOIN units u ON pu.unitId = u.id WHERE`;
  if (req.params.unit && req.params.unit !== "null") {
    query += ` upper(u.name) = upper('${req.params.unit}') AND`;
  }
  if (req.params.contractor && req.params.contractor !== "null") {
    query += ` upper(p.contractor) = upper('${req.params.contractor}') AND`;
  }
  if (req.params.name && req.params.name !== "null") {
    query += ` upper(p.name) = upper('${req.params.name}') AND`;
  }
  query += ` p.accountId = ${req.payload.accountId}`;
  console.log("QERY", query);
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
