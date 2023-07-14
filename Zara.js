const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
 const express = require('express');
 var app = express();
const bodyparser = require('body-parser');

 
var mysqlConnection = mysql.createConnection({

    host:'localhost',
    user : 'root',
    password:'',
    database:'zara'
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB-zara connection succeded');
    else

    console.log('DB-zara Connection failedd \n error : '+JSON.stringify(err,undefined, 2));
})
app.listen(3001,()=> console.log('Express server-zara work'));

// get all produit
app.get('/produit', (req, res) => {
    mysqlConnection.query('SELECT * FROM produit', (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    });
  });

   // get an prodact
app.get('/produit/:id',(req,res)=>{
    mysqlConnection.query('SELECT * FROM Prodact WHERE id = ?',[req.params.id],(err, rows, fields)=>{

  
    if(!err)
    res.send(rows);
    else
    console.log(err);
}) 
 });


 // update quant
 app.get('/updating', (req, res) => {
  const params = req.query; 
    const id = params.id;
  const quant = params.quant;
  console.log('Received Parameters:', params);
  res.send('Parameters received successfully');

 
updateProdact(quant, id);
});
const updateProdact = (quant, id) => {
  mysqlConnection.query('UPDATE prodact  SET quant=? WHERE id = ?', [quant, id], (err, rows, fields) => {
    if (!err) {
      console.log('Rows updated ex:', rows.affectedRows);
      res.send(rows);
    } else {
      console.error('Error updating prodact:', err);
      res.status(500).send('Error updating prodact');
    }
  });
};


