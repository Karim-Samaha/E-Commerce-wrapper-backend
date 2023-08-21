const express = require("express");
const reviewsController = require("../controllers/reviewsController");
const router = express.Router();

router
  .route("/")
  .get(reviewsController.getAll)
  .post(reviewsController.createOne);

router
  .route("/:id")
  .post(reviewsController.editOne)
  .delete(reviewsController.deleteOne);

module.exports = router;
