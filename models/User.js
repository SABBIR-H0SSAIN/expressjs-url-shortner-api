const mongoose= require('mongoose')
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required:true,
        trim:true
    },
    created_at: {
        type: Date,
        default: Date.now(),
    }
})

const userModel=mongoose.model('User',UserSchema)
module.exports=userModel
