const express = require("express");
const app = express();
const PORT = 5020;
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./app/config/db.js");

//DB Connection and Table Initialization
connection();

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

//User Routes
app.use("/api/v1/user", require("./app/routes/usersRoutes"));

app.listen(PORT, () => {
  console.log(`
################################################
       Server listening on port: ${PORT}
################################################
`);
});
