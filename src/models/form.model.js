const mongoose = require('mongoose');

const formBulider = new mongoose.Schema({

  questionHeader: {
    type: String,
    trim: true
  },
  questionType: {
    type: String,
    trim: true
  },
  optionValue: {
    type: Object,
    default:{}

  },
 
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }

});

const formQuestion = new mongoose.model("formQuestion", formBulider);

module.exports = formQuestion