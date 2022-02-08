// const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "root",
//   database: "subcon",
// });
// // connect to database
// db.connect((err) => {
//   if (err) {
//     console.log("MySQL: ", err);
//   }
// });

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DBSOURCE = path.resolve(__dirname, "../db/subcon.db");
let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Connected to the subcon database.");

  db.serialize(() => {
    createRolesTable();
    createUsersTable();
    createUnitsTable();
    createProjectsTable();
    createProjectUnitsTable();
    createProjectUnitWorkInProgressTable();
  });
});

function createRolesTable() {
  const tableName = "roles";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
    )`;
  createTable(tableName, sql);
}

function createUnitsTable() {
  const tableName = "units";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
    )`;
  createTable(tableName, sql);
}

function createUsersTable() {
  const tableName = "users";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT,
    username TEXT,
    password TEXT,
    role INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`;
  createTable(tableName, sql);
}

function createProjectsTable() {
  const tableName = "projects";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poNumber TEXT,
    name TEXT,
    status INTERGER,
	  description TEXT,
    contractor TEXT,
    createdBy INTEGER,
    updatedBy INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`;
  createTable(tableName, sql);
}

function createProjectUnitsTable() {
  const tableName = "project_units";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unitId INTEGER,
    unitNumber TEXT,
    modelName TEXT,
    projectId INTEGER,
    startDate TEXT,
    endDate TEXT,
    days INTEGER,
    estimatedAmount REAL,
    estimatedCost REAL,
    estimatedProfit REAL,
    status INTEGER DEFAULT 1,
    budgetTMH TEXT,
    budgetHMH TEXT,
    actualTMH TEXT,
    actualHMH TEXT,
    description TEXT,
    createdBy INTEGER,
    updatedBy INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE
    )`;
  createTable(tableName, sql);
}

function createProjectUnitWorkInProgressTable() {
  const tableName = "project_unit_wip";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectUnitId INTEGER,
    percentage INTEGER,
	  amount REAL,
    createdBy INTEGER,
    updatedBy INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectUnitId) REFERENCES project_unitss (id) ON UPDATE CASCADE ON DELETE CASCADE
    )`;
  createTable(tableName, sql);
}

function createTable(tableName, query) {
  db.run(query, (err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log(`${tableName} table has been created.`);
    }
  });
}

function insetData(tableName, query, params) {
  db.run(query, params, (err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log(`Successfully inserted data in to the ${tableName}.`);
    }
  });
}

module.exports = db;
