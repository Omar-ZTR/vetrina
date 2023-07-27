// const express = require('express');
// const bodyParser = require('body-parser');
// const zaraRoutes = require('./routes/zaraRoutes');

// var app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/', zaraRoutes);

// app.listen(3001, () => console.log('Express server-zara works'));


const express = require('express');
const zaraRoute = require('./routes/zaraRoutes');
const bodyParser = require('body-parser');

const app = express();

// Other middleware and configurations
app.use(bodyParser.json());
app.use('/produits', zaraRoute);

// Other routes and configurations

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server zara is running port ${PORT}`);
});
