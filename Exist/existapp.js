

const express = require('express');
const existRoute = require('./routes/existRoutes');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
// Other middleware and configurations

app.use('/produits', existRoute);

// Other routes and configurations

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server exist is running port ${PORT}`);
});
