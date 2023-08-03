const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const UrlS = sequelize.define(
  "UrlS",
  {
    brand: {
      type: DataTypes.STRING(30),
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING(255),
    },
    updateurl: {
      type: DataTypes.STRING(255),
    },
    paramsget: {
      type: DataTypes.STRING(255),
    },
    paramsupdate: {
     type: DataTypes.JSON,
      
    },
    method: {
      type: DataTypes.STRING(30),
    },
  },
  {
    tableName: "urls",
    timestamps: false,
  }
);

module.exports = UrlS;

