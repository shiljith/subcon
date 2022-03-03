const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const projectRouter = require("./server/routes/projects");
const dashboardRouter = require("./server/routes/dashboard");
const userRouter = require("./server/routes/users");
const wipRouter = require("./server/routes/wips");
const projectUnitRouter = require("./server/routes/project_units");
const accountRouter = require("./server/routes/accounts");
const reportRouter = require("./server/routes/reports");
const wipTimelineRouter = require("./server/routes/wip_timeline");
const dbRoute = require("./server/routes/database");
const { requestLogger, responseLogger } = require("./server/middleware/logger");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());

// Static directory path
app.use(express.static(path.join(__dirname, "dist/subcon")));

app.use(requestLogger);
// API routes
app.use("/api/project", projectRouter);
app.use("/api/user", userRouter);
app.use("/api/wip", wipRouter);
app.use("/api/project-unit", projectUnitRouter);
app.use("/api/database", dbRoute);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/account", accountRouter);
app.use("/api/report", reportRouter);
app.use("/api/wip-timeline", wipTimelineRouter);

// PORT
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Listening on port " + port);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/subcon/index.html"));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
  next();
});

module.exports = app;
