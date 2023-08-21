const Review = require("../models/Reviews");
const operations = require("./crudOperations");

exports.getAll = operations.getAll(Review);
exports.createOne = operations.createOne(Review);
exports.editOne = operations.findOneAndEdit(Review);
exports.deleteOne = operations.findOneAndDelete(Review);
