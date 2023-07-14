const mysqlConnection = require('../zaraConnection');



function createProduitTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS produit (
        zaraid INT PRIMARY KEY,
        zarabrand VARCHAR(20) NOT NULL,
        zaraname VARCHAR(20) NOT NULL,
        zaramodel VARCHAR(20) NOT NULL,
        zaraquant INT NOT NULL,
        zaracolor VARCHAR(20) NOT NULL,
        zarareference VARCHAR(20) NOT NULL
      )`;
  
    mysqlConnection.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error creating 'produit' table:", err);
      } else {
        console.log("Table 'produit' created successfully");
      }
    });
  }

const getAllProduit = (req, res) => {
  mysqlConnection.query("SELECT * FROM produit", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
};

const updateQuant = (req, res) => {
  const params = req.query;
  const id = params.id;
  const quant = params.quant;
  console.log("Received Parameters:", params);
  res.send("Parameters received successfully");

  updateProduit(quant, id);
};

const updateProduit = (quant, id) => {
  mysqlConnection.query(
    "UPDATE prodact  SET quant=? WHERE id = ?",
    [quant, id],
    (err, rows, fields) => {
      if (!err) {
        console.log("Rows updated ex:", rows.affectedRows);
        res.send(rows);
      } else {
        console.error("Error updating prodact:", err);
        res.status(500).send("Error updating prodact");
      }
    }
  );
};


module.exports = {
    getAllProduit,
    updateQuant,
    createProduitTable,
  };
  