const bcrypt= require('bcrypt');
const User= require('../../models/User.js')
const jwt= require('jsonwebtoken');
const duration_parser= require('parse-duration')
require('dotenv').config()
const parseDuration = require('parse-duration').default;

const max_session_duration = parseDuration(process.env.MAX_SESSION_DURATION || '1d');

const LoginRoute = async (req,res) => {
    const {email,password} = req.body || {};

    if(!email || !password){
        return res.status(400).send({
            status:400,
            error_code:'missing-field',
            message: "One or multipule field is missing"
        })
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).send({
            status:404,
            error_code:'invalid-credentials',
            message: "Invalid email or password"
        })  
    }

    if(! await bcrypt.compare(password,user.password)){
        return res.status(400).send({
            status:0,
            error_code:'wrong-password',
            message: "Password is incorrect"
        });  
    }

    let payload = {
        id: user._id,
        email
    }

    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{
        expiresIn: max_session_duration
    })

    res.status(200).cookie('token',token,{
        httpOnly:true,
        maxAge: max_session_duration,
    }).send({
        status:200,
        message:"User successfully authorized",
        user: {
            name: user.name,
            email:user.email
        }
    })
}

module.exports=LoginRoute;