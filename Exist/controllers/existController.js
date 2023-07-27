// // controllers/existController.js
// const mysqlConnection = require('../existConnection');



// function createProduitTable() {
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS product (
//         existid INT PRIMARY KEY,
//         existname VARCHAR(20) NOT NULL,
//         existmodel VARCHAR(20) NOT NULL,
//         existbrand VARCHAR(20) NOT NULL,
//         existquant INT NOT NULL,
//         existreference VARCHAR(20) NOT NULL
//         existcolor VARCHAR(20) NOT NULL,
//       )`;
  
//     mysqlConnection.query(createTableQuery, (err, result) => {
//       if (err) {
//         console.error("Error creating 'produit' table:", err);
//       } else {
//         console.log("Table 'produit' created successfully");
//       }
//     });
//   }


// // Get all products
// const getAllProducts = (req, res) => {
//   mysqlConnection.query('SELECT * FROM Product', (err, rows, fields) => {
//     if (!err) res.send(rows);
//     else console.log(err);
//   });
// };

// // Update quant
// const updateQuant = (req, res) => {
//   const params = req.query;
//   const id = params.id;
//   const quant = params.quant;
//   console.log('Received Parameters:', params);
//   res.send('Parameters received successfully');

//   updateProduct(quant, id);
// };

// const updateProduct = (quant, id) => {
//   mysqlConnection.query(
//     'UPDATE product SET existquant = ? WHERE id = ?',
//     [quant, id],
//     (err, rows, fields) => {
//       if (!err) {
//         console.log('Rows updated:', rows.affectedRows);
//       } else {
//         console.error('Error updating product:', err);
//         res.status(500).send('Error updating product');
//       }
//     }
//   );
// };

// module.exports = {
//   getAllProducts,
//   updateQuant,
//   createProduitTable,
// };

const Product = require('../models/existmodel');

async function createProduitTable() {
  try {
    await Product.sync({ force: false });
    console.log('Table "product" created successfully');
    return send("table create");
  } catch (err) {
    console.error('Error creating "product" table:', err);
  }
}


const insertProduct = async (req, res) => {
  try {
    const { existname, existmodel, existbrand, existquant, existreference, existcolor } = req.body;

    // Create a new product record in the database
    const newProduct = await Product.create({
      existname,
      existmodel,
      existbrand,
      existquant,
      existreference,
      existcolor,
    });

    console.log('New product inserted:', newProduct.toJSON());

    // Send a response indicating the product has been successfully inserted
    res.send('Product inserted successfully');
  } catch (err) {
    console.error('Error inserting product:', err);
    res.status(500).send('Error inserting product');
  }
};


// Get all products
// const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.findAll();
//     res.send(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error retrieving products');
//   }
// };
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    const wrappedResponse = {
      produit: products 
    };
    res.send(wrappedResponse);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving products');
  }
};
// Update quant
const updateQuant = async (req, res) => {
  const params = req.query;
  const id = params.id;
  const quant = params.quant;
  console.log('Received Parameters:', params);
  res.send('Parameters received successfully');

  try {
    await updateProduct(quant, id);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Error updating product');
  }
};

const updateProduct = async (quant, id) => {
  try {
    const updatedRows = await Product.update(
      { existquant: quant },
      { where: { existid: id } }
    );
    console.log('Rows updated:', updatedRows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    throw err; 
  }
};
const readAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
  
    const allData = {
      products,
      
    };
    
    res.send(allData);
  } catch (err) {
    console.error('Error retrieving products:', err);
    res.status(500).send('Error retrieving products');
  }
};

module.exports = {
  getAllProducts,
  updateQuant,
  createProduitTable,
  readAllProducts,
  insertProduct,
};
