const express = require("express");
const bodyParser = require("body-parser");
const vetrinaRoutes = require("./routes/vetrinaRoutes");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", vetrinaRoutes);

app.listen(4000, () => console.log("Express server-vetrina works"));
