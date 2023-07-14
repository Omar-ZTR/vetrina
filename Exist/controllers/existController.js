// controllers/existController.js
const mysqlConnection = require('../existConnection');



function createProduitTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS product (
        existid INT PRIMARY KEY,
        existname VARCHAR(20) NOT NULL,
        existmodel VARCHAR(20) NOT NULL,
        existbrand VARCHAR(20) NOT NULL,
        existquant INT NOT NULL,
        existreference VARCHAR(20) NOT NULL
        existcolor VARCHAR(20) NOT NULL,
      )`;
  
    mysqlConnection.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error creating 'produit' table:", err);
      } else {
        console.log("Table 'produit' created successfully");
      }
    });
  }


// Get all products
const getAllProducts = (req, res) => {
  mysqlConnection.query('SELECT * FROM Product', (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
};

// Update quant
const updateQuant = (req, res) => {
  const params = req.query;
  const id = params.id;
  const quant = params.quant;
  console.log('Received Parameters:', params);
  res.send('Parameters received successfully');

  updateProduct(quant, id);
};

const updateProduct = (quant, id) => {
  mysqlConnection.query(
    'UPDATE product SET existquant = ? WHERE id = ?',
    [quant, id],
    (err, rows, fields) => {
      if (!err) {
        console.log('Rows updated:', rows.affectedRows);
      } else {
        console.error('Error updating product:', err);
        res.status(500).send('Error updating product');
      }
    }
  );
};

module.exports = {
  getAllProducts,
  updateQuant,
  createProduitTable,
};
