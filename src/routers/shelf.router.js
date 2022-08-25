require("dotenv").config();
require("../config/db");
const express = require("express");
const router = new express.Router();
const shelfControllers=require("../controllers/shelf.controller")
const auth=require("../middleware/auth")



router.post("",auth,shelfControllers.addshelfUser)
router.get("/getallshelf",auth,shelfControllers.getshelfUser)
router.get("/excelfile",shelfControllers.excelfile)
router.get("/:id",auth,shelfControllers.shelfuserById)
router.patch("/:id",auth,shelfControllers.shelfpatchById);
router.delete("/:id",auth, shelfControllers.shelfdeleteById);
router.post("/upload", shelfControllers.upload.single("upload"),auth, shelfControllers.uploadXLSX);


module.exports=router