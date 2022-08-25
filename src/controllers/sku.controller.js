const skuUser=require('../models/sku.models')
const express = require("express");
require("../config/db");
const app = express();
app.use(express.json());

exports.addskuUser=async(req,res)=>{
    try {
        const sku_user = new skuUser({
            ...req.body,
        owner:req.user._id});
        await sku_user.save()
        res.status(201).send(sku_user)
    
      }
      catch (e) {
        console.log(e);
        res.status(404).send();
      }
}


exports.getskuUser = async(req, res) => {
    try{
    await req.user.populate("user_skuuser")
    
        res.send(req.user.user_skuuser);
    }
    catch(e)
    {
        console.log(e);
        res.status(404).send(e);
    }

}


exports.skuuserById = (req, res) => {
    const _id = req.params.id;
    skuUser.findOne({ _id ,owner: req.user._id})
        .then((skuuser) => {
            if (!skuuser) {
                return res.status(404).send();
            }

            res.send(skuuser);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
}

exports.skupatchById=async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowupdates = ["name","product","dayId","brand","status"];
    const valid = updates.every((update) => allowupdates.includes(update));
    if (!valid) {
        return res.status(404).send({ error: "invalid" });
    }
    try {

        const skuuser = await skuUser.findOne({_id:req.params.id,owner: req.user._id});
        updates.forEach((update) => (skuuser[update] = req.body[update]));
        await skuuser.save();
        if (!skuuser) {
            return res.status(404).send();
        }
        res.send(skuuser);
    }
    catch (e) {
        res.status(400).send(e);
    }
}

exports.skudeleteById = async (req, res) => {
    try {
        const skuuser = await skuUser.findOneAndDelete({_id:req.params.id,owner: req.user._id});
        if (!skuuser) {
            return res.status(404).send("no such user found");
        }
        res.send(skuuser);

    }
    catch (e) {
        res.status(400).send(e);
    }
}