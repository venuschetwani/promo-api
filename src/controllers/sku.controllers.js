const skuUser=require('../models/sku.models')
const express = require("express");
require("../config/db");

const app = express();
app.use(express.json());

exports.addskuUser=async(req,res)=>{
    try {
        const sku_user = new skuUser(req.body);
        await sku_user.save()
        res.status(201).send(sku_user)
    
      }
      catch (e) {
        console.log(e);
        res.status(404).send();
      }
}


exports.getskuUser = (req, res) => {
    skuUser.find({}).then((skuusers) => {
        res.send(skuusers);
    })
}


exports.skuuserById = (req, res) => {
    const _id = req.params.id;
    skuUser.find({ _id })
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
    const allowupdates = ["name","product","DayId","Brand","status"];
    const valid = updates.every((update) => allowupdates.includes(update));
    if (!valid) {
        return res.status(404).send({ error: "invalid" });
    }
    try {

        const skuuser = await skuUser.findById(req.params.id);
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
        const skuuser = await skuUser.findByIdAndDelete(req.params.id);
        if (!skuuser) {
            return res.status(404).send("no such user found");
        }
        res.send(skuuser);

    }
    catch (e) {
        res.status(400).send(e);
    }
}
