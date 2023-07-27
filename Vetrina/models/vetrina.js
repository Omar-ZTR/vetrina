const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Vetrina = sequelize.define('Vetrina', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  brand: {
    type: DataTypes.STRING(255),
  },
  id_item: {
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING(255),
  },
  model: {
    type: DataTypes.STRING(255),
  },
  quant: {
    type: DataTypes.INTEGER,
  },
  color: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'vetrina',
  timestamps: false,
});

module.exports = Vetrina;
