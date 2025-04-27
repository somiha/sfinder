const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "ronenpte_khaleed",
//   password: "khaleed268620",
//   database: "ronenpte_s_finder",
// });

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "sfinndgk_somiha",
//   password: "Somiha@2000",
//   database: "sfinndgk_s_finder",
// });

//https://sfinder.app/

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "s_finder",
});

// db.connect(function (error) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Database Connected!");
//   }
// });

module.exports = db;
