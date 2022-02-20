const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DBSOURCE = path.resolve(__dirname, "../db/subcon.db");
let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Connected to the subcon database.");
});

module.exports = db;
