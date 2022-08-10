require("../config/db");
const express = require("express");
const router = new express.Router();
const authControllers = require('../controllers/auth.controller')
const auth = require("../middleware/auth")

router.post("", authControllers.addUser)
router.post("/login", authControllers.loginUser)
router.get("/logout", auth, authControllers.logout);
router.get("/logouts", auth, authControllers.logoutAll)

module.exports = router