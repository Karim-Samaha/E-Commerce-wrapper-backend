const express = require("express");
const productsControllers = require("../controllers/porductsController");
const router = express.Router();

router
  .route("/")
  .get(productsControllers.getProducts)
  .post(productsControllers.createProduct)
  .patch(productsControllers.editProduct)
  .delete(productsControllers.deleteProduct);

module.exports = router;
