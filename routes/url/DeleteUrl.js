const UrlModel = require('../../models/Url.js')

const DeleteUrlRoute = async (req,res) => {
    if(!req?.body?.id || !req?.user?.id){
        return res.status(400).send({
            success: false,
            error_code:"id-not-specified",
            message: "No id specified to delete"
        });
    }

    const {id} = req.body;

    let findAndDelete= await UrlModel.findOneAndDelete({_id:id, user_id:req.user.id});
    if(!findAndDelete){
        return res.status(404).send({
            success: false,
            error_code:"not-found",
            message: "The provided data not found"
        });     
    }

    return res.status(200).send({
        success: true,
        message: "Deleted successfully",
    })
}

module.exports=DeleteUrlRoute