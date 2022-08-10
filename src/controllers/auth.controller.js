const User = require("../models/user");
const express = require("express");
require("../config/db");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");





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