const mongoose = require('mongoose');



const skuSchema = new mongoose.Schema({

    name: {
      type:String,
      trim: true
    },
    product: {
      type: String,
      trim: true
    },
    DayId: {
      type:Number
    },
    Brand: {
      type: String,
     
    },
    status:{
     type:String,
    
    }
});

const skuUser = new mongoose.model("skuUser", skuSchema);

module.exports =skuUser