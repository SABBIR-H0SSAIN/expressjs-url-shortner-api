const express= require('express');
const router=express.Router();

const LoginRoute = require('./Login.js');
const RegisterRoute = require('./Register.js');
const LogoutRoute = require('./Logout.js');

router.post('/register',RegisterRoute);
router.post('/login',LoginRoute);
router.post('/logout', LogoutRoute);

module.exports = router;