const { DataTypes } = require('sequelize');
const sequelize = require('../existConnection'); // Assuming you have a valid connection here

const Product = sequelize.define('products', {
  existid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  existname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  existmodel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  existbrand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  existquant: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  existreference: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  existcolor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Product;
