
const express = require('express');
const app = express();
const sequelize = require('./connection');
const vetrinaRoutes = require('./routes/vetrinaRoutes');

sequelize.sync()
  .then(() => {
    console.log('All models were synchronized successfully.');

    app.listen(4000, () => {
      console.log('Express server-vetrina works.');
    });
  })
  .catch((error) => {
    console.error('Error synchronizing models:', error);
  });

app.use(express.json());

app.use('/vetrina', vetrinaRoutes);
