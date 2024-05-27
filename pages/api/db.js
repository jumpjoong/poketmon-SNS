const { createPool } = require("mysql");

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.getConnection((err, conn) => {
  try{
    console.log("success")
  } catch {
    console.log(err,"api디비err")
  }
});

const executeQuery = async (query, arraParms) => {
  return await new Promise((resolve, reject) => {
    pool.query(query, arraParms, (err, data) => {
      resolve(data);
      reject(err);
    });
  });
};

module.exports = { executeQuery };
