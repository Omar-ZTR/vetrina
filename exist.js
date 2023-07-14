const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
 const express = require('express');
 var app = express();
const bodyparser = require('body-parser');

 
var mysqlConnection = mysql.createConnection({

    host:'localhost',
    user : 'root',
    password:'',
    database:'exist'
});


mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB-exist connection succeded');
    else

    console.log('DB-exist Connection failedd \n error : '+JSON.stringify(err,undefined, 2));
})
app.listen(3000,()=> console.log('Express server-exist work'));


// get all product
app.get('/products', (req, res) => {
    mysqlConnection.query('SELECT * FROM Product', (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    });
  });



// update quant
 app.get('/updating', (req, res) => {
  const params = req.query; 
    const id = params.id;
  const quant = params.quant;
  console.log('Received Parameters:', params);
  res.send('Parameters received successfully');

 
updateProduct(quant, id);
});
const updateProduct = (quant, id) => {
  mysqlConnection.query('UPDATE product  SET  existquant=? WHERE id = ?', [quant, id], (err, rows, fields) => {
    if (!err) {
      console.log('Rows updated: ex', rows.affectedRows);
      // res.send(rows);
    } else {
      console.error('Error updating product:', err);
      res.status(500).send('Error updating product');
    }
  });
};



