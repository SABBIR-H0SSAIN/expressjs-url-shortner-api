const router=require('express').Router();

const VerifyAuthentication = require('../../middleware/VerifyAuthentication.js');
const GenerateUrlRoute = require('./GenerateUrl.js');
const UrlListRoute = require('./UrlList.js');
const EditUrlRoute = require('./EditUrl.js');
const DeleteUrlRoute = require('./DeleteUrl.js');

router.use(VerifyAuthentication);

router.post('/generate',GenerateUrlRoute);
router.post('/list',UrlListRoute);
router.put('/update',EditUrlRoute);
router.delete('/delete',DeleteUrlRoute);

module.exports=router;