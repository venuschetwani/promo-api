const User = require("../models/user");
const express = require("express");
require("../config/db");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt=require("jsonwebtoken")
const _=require("lodash")


exports.addUser = async (req, res) => {

  try {
    const user = new User(req.body);
    await user.save()
    res.status(201).send(user)

  }
  catch (e) {

    res.status(404).send();
  }

}


exports.loginUser = async (req, res) => {
  try {
    const u = req.body.Email
    const password = req.body.Password
    const userr = await User.findOne({ Email: u })

    if (userr.Password.length > 0) {
      const user = await User.findByCredintials(
        req.body.Email,
        req.body.Password
      )
      await User.lastLogin(user._id)
      const token = await user.tokenauthkey()
      const isExpired = await User.checkTokenExpiry(token)
      if (isExpired) {
        res.status(404).send("token is expired")
      }
      else {
        res.send({ user, token })
      }
    }
    else {
      const userPassword = await bcrypt.hash(password, 8);
      const user = await User.findOneAndUpdate({ Email: u }, { Password: userPassword })
      await user.save()
      await User.lastLogin(user._id)
      const token = await user.tokenauthkey()
      res.send({user,token})
    }
  } catch (e) {
    res.status(500).send(e);
  }

}



exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send('token logout');
  } catch (e) {
    res.status(401).send();
  }
}

exports.logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("user logout all the tokens");
  } catch (e) {
    res.status(401).send(e);
  }
}

exports.forgetpassword=async(req,res)=>
{
  const v=req.body.Email;
  const userrr = await User.findOne({ Email: v })
  
    if(!userrr)
    {
      return res.status(400).json({error:"user with this email doesnot exist "})
    }
    
    const token = jwt.sign({ _id: userrr._id }, process.env.RESET_KEY, { expiresIn: '24h' })
    const mailoptions = 
    {
      from: "shubhangih.mobio@gmail.com",
      to: req.body.Email,
      subject: "forget password link",
      html:`
         <h2>Please click on given link to reset your passuordc/h2>
        <p>${process. env. APP_HOST}/resetpassword/${token} </p>
        `
    };
   
   
      let transporter = nodemailer.createTransport({
       host: "smtp.ethereal.email",
       port: 587,
       service: "gmail",
       secure: false,
       auth: {
         user: "shubhangihingu@gmail.com",
         pass: "iossrpmwotsdsdcg",
       },
      });
    let info = await transporter.sendMail(mailoptions);
    userrr.updateOne({resetlink:token},function(err,sucess)
    { 
      if(err){
     if (info.rejected == null) {
      console.log("email not send");
       return res.status(400).json({error:"reset password link error"})
     } }
     else {
       console.log(info);
       return res.json({message:"email has been sucessfully send,Kindly reset your password"})
     }
    })

  
}


exports.resetpassword=async(req,res)=>{
  const {resetlink, newPassword} =req.body;
  const hashednewPassword =await bcrypt.hash(newPassword, 8);
  if(resetlink)
  {
    jwt.verify(resetlink,process.env.RESET_KEY,function(error,decodedData){
      if(error)
      {
        return res.status(401).json({
          error:"incorrect token or it is expired"
        })
      }
      User.findOne({resetlink},(err,user)=>{
        if(err || !user)
        {
          return res.status(400).json({error:"user with this token doesnot exist"})
        }
        
        const obj={
          Password:hashednewPassword,
          resetlink:""
        }
       
        user=_.extend(user,obj)
        user.save((err,result)=>{
          if(err)
          {
            console.log(err);
            return res.status(400).json({error:"reset password error"})
          }
          else
          {
            return res.status(200).json({message:"your password is changed sucessfully"})
          }

        })
      })
    })
  }
}