const Product = require("../models/product");
const operations = require("./crudOperations");

exports.getProducts = operations.getAll(Product);

exports.createProduct = operations.createOne(Product);

exports.editProduct = operations.findOneAndEdit(Product);

exports.deleteProduct = operations.findOneAndDelete(Product);
