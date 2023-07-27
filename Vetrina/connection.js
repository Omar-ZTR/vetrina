// const mysql = require("mysql");

// const conn = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "vetrina",
// });

// conn.connect((err) => {
//   if (!err) console.log("DB-vetrina connection succeeded");
//   else
//     console.log(
//       "DB-vetrina connection failed \n error : " +
//         JSON.stringify(err, undefined, 2)
//     );
// });

// module.exports = conn;



const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('vetrina', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('DB-vetrina connection succeeded');
  })
  .catch((error) => {
    console.error('DB-vetrina connection failed:', error);
  });

module.exports = sequelize;