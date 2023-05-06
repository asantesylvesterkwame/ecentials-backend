const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require('helmet');
require("dotenv").config();

const app = express();
const keys = require("./../keys.json");
const routes = require("../routes/v1/routes");

app.set("keys", keys.ecentials);


//connect to database
const mongoose = require("./database/mongodb.js")(app.get("keys").db_name);

// Using CORS
app.use(cors());

//send post requests
app.use(express.json());

//Route middleware
app.use("", routes);

// morgan logging
app.use(morgan('dev'));

// helmet security
app.use(helmet());

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 3001, () =>
    console.log("Server running on port 3001")
  );
}

module.exports = app;
