const express = require("express");
const usersController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/auth/sign-in").post(authController.signIn);
router.route("/auth/sign-up").post(authController.signUp);
router
  .route("/auth/mail-virfication/:userId/:virficationToken")
  .post(authController.verifyEmail);

router.route("/auth/reset-password").post(authController.resetPassword);
router
  .route("/auth/password-change")
  .post(authController.changePasswordFromReset);
  
router.route("/").get(usersController.getUsers);

router
  .route("/:id")
  .get(usersController.editUser)
  .delete(usersController.deleteUser);

module.exports = router;
