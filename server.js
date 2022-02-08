const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const projectRouter = require("./server/routes/projects");
const dashboardRouter = require("./server/routes/dashboard");
const userRouter = require("./server/routes/users");
const wipRouter = require("./server/routes/wips");
const projectUnitRouter = require("./server/routes/project_units");
const dbRoute = require("./server/routes/database");

const app = express();
const corsOptions = {
  origin: "http://localhost:4200",
};

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

// API routes
app.use("/api/project", projectRouter);
app.use("/api/user", userRouter);
app.use("/api/wip", wipRouter);
app.use("/api/project-unit", projectUnitRouter);
app.use("/api/database", dbRoute);
app.use("/api/dashboard", dashboardRouter);

// PORT
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Listening on port " + port);
});

// 404 Handler
app.use((req, res, next) => {
  next(createError(404));
});

// Base Route
app.get("/", (req, res) => {
  res.send("invaild endpoint");
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
