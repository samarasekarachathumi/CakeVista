// JWT_SECRET=90e30a8d797aefff0ab0c403699e71909c021bd96a65c98f611388b1a12df6e4  require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};