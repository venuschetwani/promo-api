require("dotenv").config();
require("../config/db");
const express = require("express");
const router = new express.Router();
const skuControllers=require("../controllers/sku.controllers")




router.post("",skuControllers.addskuUser)
router.get("/getall",skuControllers.getskuUser)
router.get("/:id",skuControllers.skuuserById)
router.patch("/:id", skuControllers.skupatchById);
router.delete("/:id", skuControllers.skudeleteById);

module.exports=router