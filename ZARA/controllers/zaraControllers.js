const mysqlConnection = require('../zaraConnection');


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
  };
  