require("dotenv").config();
const sql_server = require("mssql");

//  const config = {
//     host: process.env.DB_HOST,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     options: {
//       encrypt: true,
//       enableArithAbort: true
//   }
// };
const config = {
  server: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.NAME,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

const pool = new sql_server.ConnectionPool(config);
const connection = pool.connect().catch((error) => {
  console.log(error, "Promise error");
});

async function execQuery(query) {
  await connection;
  try {
    var result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
    throw err;
  }
}

module.exports.execQuery = execQuery;
