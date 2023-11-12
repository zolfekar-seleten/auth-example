const { Router } = require("express");
const authController = require("../../controllers/api/authController");

const router = Router();

router.post("/signup", authController.signup);

module.exports = router;
