const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('exist', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('DB-exist connection succeeded');
  })
  .catch((error) => {
    console.error('DB-exist connection failed:', error);
  });

module.exports = sequelize;
