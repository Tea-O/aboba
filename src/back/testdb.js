// import sqlite from 'sqlite'
// import { open } from 'sqlite'
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");


(async () => {
    const db = await open({
      filename: './database/database.db',
      driver: sqlite3.cached.Database
    })
    await db.exec('CREATE TABLE tbl (col TEXT)')
    await db.exec('INSERT INTO tbl VALUES ("test")')
})()
