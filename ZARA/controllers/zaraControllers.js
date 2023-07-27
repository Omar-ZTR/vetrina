// const mysqlConnection = require('../zaraConnection');



const produit = require('../models/zaramodel');

async function createProduitTable() {
  try {
    await produit.sync({ force: false });
    console.log('Table "produit" created successfully');
    return send("table create");
  } catch (err) {
    console.error('Error creating "produit" table:', err);
  }
}


const insertProduit = async (req, res) => {
  try {
    const { zaraname, zaramodel, zarabrand, zaraquant, zarareference, zaracolor } = req.body;

    // Create a new product record in the database
    const newProduct = await produit.create({
      zaraid,
      zaraname,
      zaramodel,
      zarabrand,
      zaraquant,
      zarareference,
      zaracolor,
    });

    console.log('New product inserted:', newProduct.toJSON());

    // Send a response indicating the product has been successfully inserted
    res.send('Product inserted successfully');
  } catch (err) {
    console.error('Error inserting product:', err);
    res.status(500).send('Error inserting product');
  }
};
// Assuming you have imported required modules and set up Sequelize model correctly.

// Recursive function to find the path of an attribute in the data object
// function findAttributePath(obj, targetAttribute, currentPath = '') {
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       const value = obj[key];
//       const path = currentPath ? `${currentPath}.${key}` : key;
// console.log(key)
//       if (key === targetAttribute) {
//         console.log('value:', value.targetAttribute);
//         // Uncomment the next line if you only want to find the first occurrence.
//         // return;
//       }

//       if (typeof value === 'object') {
//         findAttributePath(value, targetAttribute, path);
//       }
//     }
//   }
// }

// Recursive function to get the value of an attribute at a specific path in the data object
function getValueAtPath(obj, targetPath) {
  const pathParts = targetPath.split('.');
  let currentObj = obj;

  for (const pathPart of pathParts) {
    if (currentObj.hasOwnProperty(pathPart)) {
      currentObj = currentObj[pathPart];
    } else {
      // Path does not exist, return null or throw an error, depending on your preference.
      return null;
    }
  }

  return currentObj;
}




// Get all produits
const getAllProduit = async (req, res) => {
  try {
    const produits = await produit.findAll();
    console.log(produits);
    res.status(200).json(produits); // Send the produits data as JSON response.
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving produits");
  }
};

// get data from path 
//>>>>>>>>>>>>>>>>>>>>>>>>
function getValueAtPath(obj, path) {
  const pathSegments = path.split('.');
  let value = obj;

  for (const segment of pathSegments) {
    value = value[segment];
    if (value === undefined) {
      value = null; // Set the value to null if the path doesn't exist
      break;
    }
  }

  return value;
}
function getAllAttributeValues(data, attributePaths) {
  const attributeValuesList = [];

  for (const targetPath of attributePaths) {
    const attributeValues = data.map(obj => getValueAtPath(obj, targetPath));
    attributeValuesList.push(attributeValues);
  }

  return attributeValuesList;
}
const getAllAttriValues = async (req, res) => {
  try {
    const data = await getAllProduit();
    console.log(data)
    const attributePaths = ['dataValues.zaraid' ,'dataValues.zaraname','dataValues.zaracolor']; // Assuming the attribute paths are provided as a query parameter array

    if (!attributePaths.every(Boolean)) {
      return res.status(400).json({ error: 'Invalid or missing path(s) provided.' });
    }

    const attributeValuesList = getAllAttributeValues(data, attributePaths);

    console.log('Attribute values for each path:', attributeValuesList);
    res.json(attributeValuesList);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }

};

//>>>>>>>>>>>>>>>



const getpath = async (req, res) => {
  try {
    const data = await getAllProduit();
    const targetPath = "0.dataValues.zaraid"; // Assuming the targetPath is provided as a query parameter

    const valueAtPath = getValueAtPath(data, targetPath);
    console.log("Value at path:", valueAtPath);
    
    res.json({ valueAtPath });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Usage: Get data from getAllProduit and call findAttributePath
// getAllProduit().then((data) => {
//   // console.log("Data:", data);
// const valueAtPath = getValueAtPath(data, targetPath);
// console.log("Value at path:", valueAtPath); // Output: Value at path: 12345

// //   console.log("Finding attribute path...");
// //   findAttributePath(data, 'zaraid');
// });

// Update produit quantity
const updateQuant = async (req, res) => {
  const params = req.query;
  const id = params.id;
  const quant = params.quant;
  console.log("Received Parameters:", params);
  res.send("Parameters received successfully");

  try {
    await updateProduit(quant, id);
  } catch (err) {
    console.error("Error updating produit:", err);
    res.status(500).send("Error updating produit");
  }
};

const updateProduit = async (quant, id) => {
  try {
    const affectedRows = await produit.update({ zaraquant: quant }, { where: { zaraid: id } });
    console.log("Rows updated:", affectedRows);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllProduit,
  updateQuant,
  createProduitTable,
  getpath,
  insertProduit,
  getAllAttriValues,
};
