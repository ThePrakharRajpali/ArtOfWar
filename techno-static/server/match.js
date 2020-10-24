const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,

    userRed: {
        type: String,
    },
    
    userBlue: {
        type: String,

    },

    room:{
        type:Number,
    },

    redPoint: {
        type: Number,
    },

    bluePoint: {
        type: Number,
    },

    redTime:{
        type: Number,
    },

    blueTime:{
        type:Number
    },
    
    winner:{
        type:Number
    }

})

module.exports = mongoose.model("match", matchSchema);