const express = require("express");
const router = express.Router();
const {
  createAccount,
  updateBio,
} = require("../controller/createAccountController");
const { loginAccount } = require("../controller/loginAccountController");
router.route("/signup").post(createAccount);
router.route("/login").post(loginAccount);
router.route("/update/bio").patch(updateBio);

module.exports = router;
