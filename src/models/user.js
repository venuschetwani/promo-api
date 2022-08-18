require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require('jsonwebtoken')
const datenow = new Date()

const userSchema = new mongoose.Schema({

  FirstName: {
    type: String,
    trim: true
  },
  LastName: {
    type: String,
    trim: true
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },
  Password: {
    type: String,
    default: ''
  },
  Role: {
    type: String
  },
  lastLogin: {
    type: String,
    default: datenow.toLocaleString().replace(',', ' ')
  },
  tokens: [{
    token: String,

  }],
  resetlink:{
    data:String,
    default:''

  }

}, {
  timestamps: true
});





//login confirmation
userSchema.statics.findByCredintials = async (email, password) => {

  const user = await User.findOne({ Email: email });

  if (!user) {
    console.log("no such user found");
    throw new Error("no such user");
  }

  const isMatch = await bcrypt.compare(password, user.Password);
  
  if (!isMatch) {
    console.log("error not compared");
    throw new Error("unauthorized");
  }

  return user
};


//token generate
userSchema.methods.tokenauthkey = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY, { expiresIn: '24h' })
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token

}

//hiding the data
userSchema.methods.toJSON = function () {
  const user = this
  const objectUser = user.toObject()
  delete objectUser.Password
  delete objectUser.tokens
  delete objectUser.resetlink
  return objectUser

}


//checking the expiry token
userSchema.statics.checkTokenExpiry = (token) => {
  var isExpiredToken = false
  var decoded = jwt.decode(token);
  var dateNow = new Date();
  if (decoded.exp * 1000 > dateNow.getTime()) {
    isExpiredToken = false;
  }
  else {
    isExpiredToken = true;
  }
  return isExpiredToken
}


//lastlogin
userSchema.statics.lastLogin = async (id) => {
  try {

    const user = this;
    const DateNow = new Date()
    const d = DateNow.toLocaleString().replace(',', ' ')
    user = await User.findByIdAndUpdate(id, { lastLogin: d },
      function (err, docs) {
        if (!err) {
          return user;
        }
      })

    return user
  } catch (error) {
   // console.error(error);
  }
}



const User = new mongoose.model("User", userSchema);

module.exports =User