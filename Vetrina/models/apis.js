const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Apis = sequelize.define(
  "Apis",
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
    typeUrlUpdate: {
      type: DataTypes.STRING(30),
      validate: {
        isIn: [["Query Parameters", "URL Path", "Request Body"]],
      },
    },
 
    pathid_item: {
      type: DataTypes.STRING(30),
    },
    pathname: {
      type: DataTypes.STRING(30),
    },
    pathmodel: {
      type: DataTypes.STRING(30),
    },
    pathquant: {
      type: DataTypes.STRING(30),
    },
    pathcolor: {
      type: DataTypes.STRING(30),
    },
    delimiter: {
      type: DataTypes.STRING(2),
    },
  },
  {
    tableName: "apis",
    timestamps: false,
  }
);

module.exports = Apis;
