const sqlite3 = require("sqlite3").verbose();
const { configDefaultDb } = require("./sql/config.sql");
const {
  profileTable,
  taskItemTable,
  taskTable,
  settingTable,
  userTable,
  dbConnTable,
} = require("./sql/init.sql");

const path = require("path");

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    // configDb(db);
    createTable(db);
  }
});

function configDb(db) {
  runQuery(db, configDefaultDb);
}

function createTable(db) {
  runQuery(db, settingTable);
  runQuery(db, userTable);
  runQuery(db, profileTable);
  runQuery(db, dbConnTable);
  runQuery(db, taskTable);
  runQuery(db, taskItemTable);
}

const pgConfig = async (userConfigId) => {
  const sql = "SELECT conn_name FROM user_config WHERE id=?";
  const params = [userConfigId];
  const res = await new Promise((resolve, reject) => {
    db.all(sql, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
  const fs = require("fs");
  const dirPath = path.join(__dirname, `../workspace/config`);

  let config = fs.readFileSync(`${dirPath}/${res[0].conn_name}.json`);
  config = JSON.parse(config.toString());
  return config;
};

function runQuery(db, sql) {
  db.run(sql, (err) => {
    if (err) {
      // console.log("Run query: ", err);
    }
  });
}

module.exports = { db, pgConfig };
