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
    SELECT SUM(pu.unitValue) as totalWorkValue FROM project_units as pu
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
    WHERE puw.status = 1 AND p.accountId =  ${req.payload.accountId} 
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
    SELECT (pu.unitValue - SUM(puw.amount)) as balanceWorkValue FROM project_unit_wip as puw
    JOIN project_units as pu ON pu.id = puw.projectUnitId
    JOIN projects as p ON p.id = pu.projectId 
    WHERE p.accountId = ${req.payload.accountId} GROUP BY pu.id   
  `;
  db.all(query, (error, result, fields) => {
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

router.get("/month-wise-work-value/:year", auth, (req, res) => {
  const year = req.params.year;
  const monthWiseWorkValue = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [],
        label: "Billing",
        pointRadius: 5,
        pointHoverRadius: 10,
      },
    ],
  };
  const query = `
  select coalesce(sum(jan_est),0) as jan_est, coalesce(sum(feb_est),0) as feb_est, coalesce(sum(mar_est),0) as mar_est, coalesce(sum(apr_est),0) as apr_est, coalesce(sum(may_est),0) as may_est,
  coalesce(sum(jun_est),0) as jun_est,coalesce(sum(jul_est),0) as jul_est,coalesce(sum(aug_est),0) as aug_est,coalesce(sum(sep_est),0) as sep_est,coalesce(sum(oct_est),0) as oct_est,
  coalesce(sum(nov_est),0) as nov_est,coalesce(sum(dec_est),0) as dec_est from(
  select 
  case when month='01' then total_est else 0 end as jan_est,
  case when month='02' then total_est else 0 end as feb_est,
  case when month='03' then total_est else 0 end as mar_est,
  case when month='04' then total_est else 0 end as apr_est,
  case when month='05' then total_est else 0 end as may_est,
  case when month='06' then total_est else 0 end as jun_est,
  case when month='07' then total_est else 0 end as jul_est,
  case when month='08' then total_est else 0 end as aug_est,
  case when month='09' then total_est else 0 end as sep_est,
  case when month='10' then total_est else 0 end as oct_est,
  case when month='11' then total_est else 0 end as nov_est,
  case when month='12' then total_est else 0 end as dec_est
  from
  (
  select 
  strftime('%m',puw.updatedAt) as month,
  sum(puw.amount) as total_est
  from project_units a
  inner join projects b on a.projectId=b.id and b.accountId=${req.payload.accountId}
  inner join project_unit_wip puw on puw.projectUnitId = a.id
  where strftime('%Y',puw.updatedAt) = '${year}' and puw.status=1
  group by strftime('%m',puw.updatedAt)
  )A
  )B
  `;
  console.log("Line GRAPH", query);
  db.get(query, (error, result, fields) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    if (result) {
      monthWiseWorkValue.datasets[0].data = Object.values(result);
      return res.json({ success: true, data: monthWiseWorkValue });
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  });
});

router.get("/get-project-unit-count", auth, (req, res) => {
  const query = `
    select coalesce(sum(escalator),0) as escalator,coalesce(sum(elevator),0) as elevator,coalesce(sum(travelator),0) as travelator from(
    select 
    coalesce(case when upper(name)='ESCALATOR' then cnt end,0) as escalator,
    coalesce(case when upper(name)='ELEVATOR' then cnt end,0) as elevator,
    coalesce(case when upper(name)='TRAVELATOR' then cnt end,0) as travelator
    from(
    SELECT b.name,count(*) as cnt
    from project_units a
    join units b on a.unitId=b.id and b.accountId = ${req.payload.accountId}
    group by b.name
    )A
    )B
  `;
  console.log("QA", query);
  db.get(query, (error, result) => {
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

router.get("/project-status", auth, (req, res) => {
  const projectStatus = {
    labels: ["In Progress", "On Hold", "Completed"],
    datasets: [
      {
        data: [],
      },
    ],
  };

  const query = `
  select sum(InProgress_count) as InProgress_count, sum(hold_count) as hold_count, sum(completed_count) as completed_count from(
    select 
    case when status = 1 then sumone
      else 0 end as InProgress_count,
    case when status = 2 then sumone
      else 0 end as hold_count,
    case when status = 3 then sumone
      else 0 end as completed_count from (
      SELECT status, count(*) as sumOne  from projects WHERE accountId = ${req.payload.accountId} GROUP by status 
    )A
  )B 
  `;
  db.get(query, (error, result, fields) => {
    if (error) {
      return res.status(404).json({ success: false, data: null, error: error });
    }
    if (result) {
      projectStatus.datasets[0].data = Object.values(result);
      return res.json({ success: true, data: projectStatus });
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  });
});

router.get("/man-hour", auth, (req, res) => {
  const query = `
    SELECT coalesce(sum(budgetTMH),0) as estimatedTechnician, coalesce(sum(budgetHMH),0) as estimatedHelper,
    coalesce(sum(actualTMH),0) as actualTechnician, coalesce(sum(actualHMH),0) as actualHelper,
    technicianSalary, helperSalary
    from project_units a
    join projects b on a.projectId=b.id and accountId=${req.payload.accountId}
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

module.exports = router;
