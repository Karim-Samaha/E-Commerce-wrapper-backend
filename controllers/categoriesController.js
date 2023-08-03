const Category = require("../models/category");
const operations = require("./crudOperations");

exports.getCtg = operations.getAll(Category);

exports.createCtg = operations.createOne(Category);

exports.editCtg = operations.findOneAndEdit(Category);

exports.deleteCtg = operations.findOneAndDelete(Category);
