const express = require("express");
const confessionController = require("../controllers/confessionController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/myconfess").get(confessionController.getMyConfessions);

router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(confessionController.getAllConfessions)
  .post(confessionController.createNewConfession);
router.route("/getpending").get(confessionController.getPending);
router.route("/accept").put(confessionController.acceptConfession);
router.route("/reject").put(confessionController.rejectConfession);
router.route("/approved").get(confessionController.getApprovedConfessions);
router.route("/history").get(confessionController.getHisoryConfessions);
router.route("/analyze").get(confessionController.Analyze);

module.exports = router;
