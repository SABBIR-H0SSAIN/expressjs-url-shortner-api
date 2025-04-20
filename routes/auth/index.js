const express= require('express');
const router=express.Router();
const LoginRoute = require('./Login.js');
const RegisterRoute = require('./Register.js');

router.post('/register',RegisterRoute);
router.post('/login',LoginRoute);

module.exports = router;