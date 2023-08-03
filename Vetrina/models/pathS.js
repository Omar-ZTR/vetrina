const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const pathS = sequelize.define(
  "pathS",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brand: {
      type: DataTypes.STRING(30),
    },
   
    nameAttribute: {
      type: DataTypes.STRING(30),
    },
    pathAttribute: {
      type: DataTypes.STRING(30),
    },
    url: {
      type: DataTypes.STRING(255),
    },
    params: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "pathS",
    timestamps: false,
  }
);

module.exports = pathS;
