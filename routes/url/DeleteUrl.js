const UrlModel = require('../../models/Url.js')

const DeleteUrlRoute = async (req,res) => {
    if(!req?.body?.id || !req?.user?.id){
        return res.status(400).send({
            status:400,
            error_code:"id-not-specified",
            message: "No id specified to delete"
        });
    }

    const {id} = req.body;

    let findAndDelete= await UrlModel.findOneAndDelete({_id:id, user_id:req.user.id});
    if(!findAndDelete){
        return res.status(404).send({
            status:404,
            error_code:"not-found",
            message: "The provided data not found"
        });     
    }

    return res.status(200).send({
        status:200,
        message: "Deleted successfully",
    })
}

module.exports=DeleteUrlRoute