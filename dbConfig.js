// dbConfig.js
module.exports = {
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 1433,
    options: {
      encrypt: true,
      enableArithAbort: true,
    },
  };
  