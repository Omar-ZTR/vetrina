const express = require('express');
const bodyParser = require('body-parser');
const existRoutes = require('./routes/existRoutes');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', existRoutes);

app.listen(3000, () => console.log('Express server-exist works'));