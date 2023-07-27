
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('zara', 'root', '', {
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