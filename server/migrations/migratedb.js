import execsql from 'execsql';

require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

const sql = `use ${process.env.DB_TEST};`;
const sqlFile = `${__dirname}/test.sql`;

execsql.config(dbConfig)
  .exec(sql, (err, result) => {
    if (err) {
      throw err;
    }
  })
  .execFile(sqlFile, (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    process.exit();
  });
