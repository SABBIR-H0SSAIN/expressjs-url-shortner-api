const UrlModel = require('../../models/Url.js')

const RedirectUrl = async (req,res) => {
    if(!req.params || !req.params.slug){
        return res.status(404).send("404 Not found");
    }

    const {slug} = req.params;

    let data = await UrlModel.findOne({slug});
    
    if(!data){
        return res.status(404).send("404 Not found");      
    }

    data.clicks++;
    await data.save();

    return res.redirect(data.url);
}

module.exports=RedirectUrl