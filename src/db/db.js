/* eslint-disable linebreak-style */
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

class Database {
  constructor() {
    this.config = {
      host: 'localhost',
      user: process.env.db_user,
      database: process.env.db_name,
      password: process.env.db_password,
      port: 5432,
    };

    this.pool = new Pool(this.config);
  }

  query(sql) {
    return this.pool.query(sql);
  }

  close() {
    this.pool.end();
  }
}

module.exports = new Database();
