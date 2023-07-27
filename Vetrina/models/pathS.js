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
    // url: {
    //   type: DataTypes.STRING(255),
    // },
    // updateurl: {
    //   type: DataTypes.STRING(255),
    // },
    // typeUrlUpdate: {
    //   type: DataTypes.STRING(30),
    //   validate: {
    //     isIn: [["Query Parameters", "URL Path", "Request Body"]],
    //   },
    // },
    // table_Name: {
    //   type: DataTypes.STRING(30),
    // },
    id_item: {
      type: DataTypes.STRING(30),
    },
    name: {
      type: DataTypes.STRING(30),
    },
    model: {
      type: DataTypes.STRING(30),
    },
    quant: {
      type: DataTypes.STRING(30),
    },
    color: {
      type: DataTypes.STRING(30),
    },
  },
  {
    tableName: "pathS",
    timestamps: false,
  }
);

module.exports = pathS;
