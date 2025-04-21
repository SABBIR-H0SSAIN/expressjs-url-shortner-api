require('dotenv').config()
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const parseDuration = require('parse-duration').default;
const User= require('../../models/User.js')
const max_session_duration = parseDuration(process.env.MAX_SESSION_DURATION || '1d');

const LoginRoute = async (req,res) => {
    const {email,password} = req.body || {};

    if(!email || !password){
        return res.status(400).send({
            success: false,
            error_code:'missing-field',
            message: "One or multipule field is missing"
        })
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).send({
            success: false,
            error_code:'invalid-credentials',
            message: "Invalid email or password"
        })  
    }

    const isValidPassword = await bcrypt.compare(password,user.password);

    if(!isValidPassword){
        return res.status(400).send({
            success: false,
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
        secure: process.env.NODE_ENV === 'production',
        maxAge: max_session_duration,
    }).send({
        success: true,
        message:"User successfully authorized",
        user: {
            name: user.name,
            email:user.email
        }
    })
}

module.exports=LoginRoute;