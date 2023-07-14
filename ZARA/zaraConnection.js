
const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zara',
});

mysqlConnection.connect((err) => {
  if (!err) console.log('DB-exist connection succeeded');
  else
    console.log(
      'DB-exist connection failed \n error : ' +
        JSON.stringify(err, undefined, 2)
    );
});

module.exports = mysqlConnection;
