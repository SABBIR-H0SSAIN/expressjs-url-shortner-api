const UrlModel = require('../../models/Url.js')

const UrlListRoute = async (req,res) => {
    if(!req.user || !req?.user?.id){
        return res.status(400).send({
            status:400,
            error_code:"user-not-authorized",
            message: "User not authorized"
        })
    }

    let data = await UrlModel.find({user_id:req.user.id});

    return res.status(200).send({
        status:200,
        message:"Url list fetched successfully",
        size: data.length,
        data: data.map((item) => {
            return {
                id: item._id,
                title:item.title,
                url: item.url,
                generated_url: process.env.BASE_URL + "/" + item.slug,
                slug: item.slug,
                clicks: item.clicks,
                created_at: item.created_at,
            }
        })
    })
}

module.exports=UrlListRoute