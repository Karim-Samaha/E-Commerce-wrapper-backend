const express = require("express");
const categoriesController = require("../controllers/categoriesController");

const router = express.Router();

router
  .route("/")
  .get(categoriesController.getCtg)
  .post(categoriesController.createCtg);

router
  .route("/:id")
  .patch(categoriesController.editCtg)
  .delete(categoriesController.deleteCtg);

module.exports = router;
