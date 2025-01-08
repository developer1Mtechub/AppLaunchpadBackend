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
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use("/uploads", express.static("uploads"));

//User Routes
app.use("/api/v1/users", require("./app/routes/usersRoutes"));

//Project Routes
app.use("/api/v1/projects", require("./app/routes/projectRoutes"));

// Asset Routes
app.use("/api/v1/upload", require("./app/upload-images.js"));

app.listen(PORT, () => {
  console.log(`
################################################
       Server listening on port: ${PORT}
################################################
`);
});
