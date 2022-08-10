require("dotenv").config();
require("../config/db");
const auth = require("../middleware/auth")
const express = require("express");
const router = new express.Router();
const userControllers = require('../controllers/user.controller')



router.get("", userControllers.getUser)
router.get("/me", auth, userControllers.getUserauth)
router.get("/:id", userControllers.userById);
router.patch("/me", auth, userControllers.patchAll);
router.patch("/:id", userControllers.patchById);
router.delete("/me", auth, userControllers.deleteByAuth);
router.delete("/:id", userControllers.deleteById);

module.exports = router