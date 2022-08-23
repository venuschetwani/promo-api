require("../config/db");
const express = require("express");
const router = new express.Router();
const authControllers = require('../controllers/auth.controller')
const auth = require("../middleware/auth")


router.post("",auth,authControllers.addUser)
router.post("/register",authControllers.register)
router.post("/login", authControllers.loginUser)
router.get("/logout", auth, authControllers.logouttoken);
router.get("/logouts", auth, authControllers.logoutAll)
router.put("/forgetpassword",authControllers.forgetpassword)
router.put("/resetpassword",authControllers.resetpassword)
router.put("/changepassword",auth,authControllers.changepwd)

module.exports = router