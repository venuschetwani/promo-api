require("dotenv").config();
require("../config/db");
const express = require("express");
const router = new express.Router();
const formControllers = require("../controllers/form.controller")
const auth = require("../middleware/auth")



//CRUD operations on form
router.post("", auth, formControllers.addQuestion)
router.get("/getallquestions", auth, formControllers.getQuestion)
router.get("/:id", auth, formControllers.getQuestionById)
router.put("/:id", auth, formControllers.questionpatchById);
router.delete("/:id", auth, formControllers.questiondeleteById);

module.exports = router