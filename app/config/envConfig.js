require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  emailUser: process.env.EMAIL_GMAIL_SERVICE,
  emailPass: process.env.EMAIL_PASS,
};
