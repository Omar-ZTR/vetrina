const express = require('express');
const bodyParser = require('body-parser');
const zaraRoutes = require('./routes/zaraRoutes');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', zaraRoutes);

app.listen(3001, () => console.log('Express server-zara works'));