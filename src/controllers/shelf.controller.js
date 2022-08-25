const shelfUser = require('../models/shelf.model')
const express = require("express");
require("../config/db");
const app = express();
app.use(express.json());
const multer = require("multer");
const xlsx = require("xlsx")
const exceljs = require("exceljs")
const path = require('path')
const fs = require('fs')

exports.addshelfUser = async (req, res) => {
  try {
    const shelf_user = new shelfUser({
      ...req.body,
      owner: req.user._id
    });
    await shelf_user.save()
    res.status(201).send(shelf_user)

  }
  catch (e) {
    console.log(e);
    res.status(404).send();
  }
}


exports.getshelfUser = async (req, res) => {
  try {
    await req.user.populate("user_shelfuser")

    res.send(req.user.user_shelfuser);
  }
  catch (e) {
    console.log(e);
    res.status(404).send(e);
  }

}


exports.shelfuserById = (req, res) => {
  const _id = req.params.id;
  shelfUser.findOne({ _id, owner: req.user._id })
    .then((shelfuser) => {
      if (!shelfuser) {
        return res.status(404).send();
      }

      res.send(shelfuser);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
}

exports.shelfpatchById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowupdates = ["name", "description", "shelfPath", "status"];
  const valid = updates.every((update) => allowupdates.includes(update));
  if (!valid) {
    return res.status(404).send({ error: "invalid" });
  }
  try {

    const shelfuser = await shelfUser.findOne({ _id: req.params.id, owner: req.user._id });
    updates.forEach((update) => (shelfuser[update] = req.body[update]));
    await shelfuser.save();
    if (!shelfuser) {
      return res.status(404).send();
    }
    res.send(shelfuser);
  }
  catch (e) {
    res.status(400).send(e);
  }
}

exports.shelfdeleteById = async (req, res) => {
  try {
    const shelfuser = await shelfUser.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!shelfuser) {
      return res.status(404).send("no such user found");
    }
    res.send(shelfuser);

  }
  catch (e) {
    res.status(400).send(e);
  }
}








exports.uploadXLSX = async (req, res) => {
  try {
    var workbook = xlsx.readFile(req.file.path);
    console.log(workbook);
    var sheet_name_list = workbook.SheetNames;
    let jsonData = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );
    console.log(jsonData);
    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "xml sheet has no data",
      });
    }
    let savedData = await shelfUser.create(jsonData);

    return res.status(201).json({
      success: true,
      message: savedData.length + " rows added to the database",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.upload = multer({ storage: storage });







exports.excelfile = async (req, res) => {
  try {
    const users = await shelfUser.find({})
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('shelfUser')
    worksheet.columns = [
      { header: 'S.no', key: 's_no', width: 10 },
      { header: 'name', key: 'name', width: 10 },
      { header: 'description', key: 'description', width: 20 },
      { header: 'shelfPath', key: 'shelfPath', width: 20 },
      { header: 'status', key: 'status', width: 10 },
      { header: 'owner', key: 'owner', width: 30 }

    ];

    let count = 1;
    users.forEach(user => {
      user.s_no = count;
      if(user.owner)
      {
        console.log(worksheet.columns[4]);
        user.owner.value=user.owner.toString()
      }
      count++;
      worksheet.addRow(user);
      
      
      
     })
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    })
    

    workbook.xlsx.writeFile('users.xlsx').then(function () {
      console.log('file is written');
    });

     res.status(200).send({message:"excel file created"})
  }
  catch (e) {
    console.log(e);
    res.status(404).send(e)
  }
}

