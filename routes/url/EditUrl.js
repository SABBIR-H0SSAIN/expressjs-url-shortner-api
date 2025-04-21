const UrlModel = require('../../models/Url.js')
const validator = require('validator');

const min_length = process.env.MIN_SLUG_LENGTH;
const max_length = process.env.MAX_SLUG_LENGTH;
const slug_length = process.env.AUTO_GENERATED_SLUG_LENGTH;
const max_attempt = process.env.MAX_ATTEMPT_SLUG;
const base_url = process.env.BASE_URL;
var update_count = 0;

const EditUrlRoute = async (req,res) => {
    let {id,title,slug} = req.body || {};

    if(!id){
        return res.status(400).send({
            success: false,
            error_code:"id-not-specified",
            message: "Id not specified to update"
        })
    }
    
    if(slug && typeof slug != "string"){
        slug=String(slug);
    }

    if (slug && (slug.length < min_length || slug.length > max_length || !validator.isSlug(slug))) {
        return res.status(400).send({
            success: false,
            error_code:"invalid-slug",
            message: "Invalid slug provided. Slug should be between "+min_length+" to "+max_length+" characters. Only letters, numbers and hyphens accepted"
        })
    }

    let target_data = await UrlModel.findOne({ _id: id, user_id: req.user.id });

    if(!target_data){
        return res.status(404).send({
            success: false,
            error_code:"not-found",
            message: "The provided id not found"
        })
    }

    if(title && title != target_data.title){
        target_data.title = title;
        update_count++;
    }

    if (slug) {
        const slugExists = await UrlModel.findOne({ slug });
        if (slugExists) {
            return res.status(409).send({
                success: false,
                error_code: "slug-already-exists",
                message: "Slug already in use. Choose another one"
            });
        }
        target_data.slug = slug;
        update_count++;
    }
    
    if(update_count > 0){
        let saved= await target_data.save();
        if(!saved ){
            return res.status(400).send({
                success: false,
                error_code:"unknown-error",
                message: "Unknown error occcured try again"
            })
        }
    }

    let response = {
        success: true,
        message: "Url updated successfully",
        data: {
            title: target_data.title,
            url: target_data.url,
            slug: target_data.slug,
            generated_url: base_url + '/' + target_data.slug,
        }
    }

    return res.status(200).send(response);

}

module.exports=EditUrlRoute;