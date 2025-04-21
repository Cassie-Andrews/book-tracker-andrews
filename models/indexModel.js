const userModel = require("./userModel");
const bookModel = require("./bookModel");
const checkAuth = require('../middleware/auth');

module.exports = { userModel, bookModel }