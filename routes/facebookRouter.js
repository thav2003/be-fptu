const express = require("express");
const toolController = require("../controllers/toolController");
const authController = require("../controllers/authController");

const router = express.Router();
router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.route("/cancel/:fbID").delete(toolController.Cancel);

module.exports = router;
