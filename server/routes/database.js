const express = require("express");
const db = require("../config/db.config");

const router = express.Router();

const tables = [
  "accounts",
  "roles",
  "units",
  "users",
  "projects",
  "project_units",
  "project_unit_wip",
  "project_unit_wip_timeline",
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

router.post("/create", (req, res) => {
  db.serialize(() => {
    createAccountsTable();
    createRolesTable();
    createUsersTable();
    createUnitsTable();
    createProjectsTable();
    createProjectUnitsTable();
    createProjectUnitWorkInProgressTable();
    createProjectUnitWorkInProgressTimelineTable();
  });
});

function createAccountsTable() {
  const tableName = "accounts";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    logo TEXT,
    address TEXT,
    technicianSalary REAL,
    helperSalary REAL,
    paymentStatus INTEGER,
    paymentDate TEXT,
    paymentValidDate TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`;
  createTable(tableName, sql);
}

function createRolesTable() {
  const tableName = "roles";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accountId INTEGER,
    name TEXT
    )`;
  createTable(tableName, sql);
}

function createUnitsTable() {
  const tableName = "units";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accountId INTEGER,
    name TEXT
    )`;
  createTable(tableName, sql);
}

function createUsersTable() {
  const tableName = "users";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accountId INTEGER,
    firstName TEXT,
    lastName TEXT,
    username TEXT,
    password TEXT,
    role INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts
      FOREIGN KEY (accountId)
      REFERENCES accounts(id)
      ON DELETE CASCADE
    )`;
  createTable(tableName, sql);
}

function createProjectsTable() {
  const tableName = "projects";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accountId INTEGER,
    poNumber TEXT,
    name TEXT,
    status INTERGER,
	  description TEXT,
    contractor TEXT,
    pinned INTEGER DEFAULT 0,
    createdBy INTEGER,
    updatedBy INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts
      FOREIGN KEY (accountId)
      REFERENCES accounts(id)
      ON DELETE CASCADE
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
    unitValue REAL,
    adminCost INTEGER,
    estimatedCost REAL,
    estimatedProfit REAL,
    actualCost REAL,
    actualProfit REAL,
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
    CONSTRAINT fk_projects
      FOREIGN KEY (projectId)
      REFERENCES projects(id)
      ON DELETE CASCADE
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
    comments TEXT,
    invoiceNumber TEXT,
    status INTEGER DEFAULT 0,
    createdBy INTEGER,
    updatedBy INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_units
      FOREIGN KEY (projectUnitId)
      REFERENCES project_units(id)
      ON DELETE CASCADE
    )`;
  createTable(tableName, sql);
}

function createProjectUnitWorkInProgressTimelineTable() {
  const tableName = "project_unit_wip_timeline";
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wipId INTEGER,
    action TEXT,
    description TEXT,
    icon TEXT,
    createdBy INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_unit_wip
      FOREIGN KEY (wipId)
      REFERENCES project_unit_wip(id)
      ON DELETE CASCADE
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

module.exports = router;
