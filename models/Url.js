const mongoose = require('mongoose');
require('dotenv').config()

const urlShorterSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Types.ObjectId,
        required:true
    },
    title:{
        type: String,
        required:true,
        trim:true,
        maxLength:process.env.MAX_TITLE_LENGTH
    },
    url : {
        type: String,
        required:true
    },
    slug : {
        type: String,
        required: true,
        unique: true,
        maxLength:process.env.MAX_SLUG_LENGTH
    },
    clicks:{
        type: Number,
        default:0,
    },
    created_at:{
        type: Date,
        required:true,
        default: Date.now(),
    },

})

const UrlModel = mongoose.model('Url',urlShorterSchema);
module.exports=UrlModel;