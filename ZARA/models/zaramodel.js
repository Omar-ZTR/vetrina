const { DataTypes } = require("sequelize");
const sequelize = require("../zaraConnection");
// Old Produit model definition
const Produit = sequelize.define('produit', {
  zaraid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  zarabrand: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  zaraname: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  zaramodel: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  zaraquant: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  zaracolor: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  zarareference: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: "produit",
  timestamps: false,
});


module.exports = Produit;
