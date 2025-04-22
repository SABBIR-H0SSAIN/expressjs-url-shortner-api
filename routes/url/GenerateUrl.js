const UrlModel = require('../../models/Url.js')
const validator = require('validator');

const min_length = process.env.MIN_SLUG_LENGTH;
const max_length = process.env.MAX_SLUG_LENGTH;
const auto_slug_length = process.env.AUTO_GENERATED_SLUG_LENGTH;
const max_attempt = process.env.MAX_ATTEMPT_SLUG;
const base_url = process.env.BASE_URL;

function generateRandomSlug(length) {
  const characters = 'aABbcdefghCDEFijkMNlmnGHIJKLopqrsOPQRSTtuvwxyz01234UVWXYZ56789';
  let slug = '';
  for (let i = 0; i < length; i++) {
    slug += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return slug
}


async function generateSlug(length = auto_slug_length) {
    length = Math.max(length,auto_slug_length);

    for (let i = 0; i < max_attempt; i++) {
        const slug = generateRandomSlug(length);
        const exists = await UrlModel.findOne({ slug });
        if (!exists) return slug;
    }
    return null;
}

const GenerateUrlRoute = async (req,res) => {
    let {title,url,slug} = req.body || {};

    if(!title || !url){
        return res.status(400).send({
            success: false,
            error_code:"missing-field",
            message: "One or multiple fields are missing"
        })
    }

    if(!await validator.isURL(url)){
        return res.status(400).send({
            success: false,
            error_code:"invalid-url",
            message: "Invalid Url Provided"
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

    let final_slug = slug || await generateSlug();

    if(!final_slug){
        return res.status(400).send({
            success: false,
            error_code:"unknown-error",
            message: "Unknown error occured"
        })
    }

    let data = new UrlModel({
        user_id: req.user.id,
        title,
        url,
        slug:final_slug,
    })
    
    if (slug) {
        const slugExists = await UrlModel.findOne({ slug });
        if (slugExists) {
            return res.status(409).send({
                success: false,
                error_code: "slug-already-exists",
                message: "Slug already in use. Choose another or leave empty for auto-generation."
            });
        }
    }
    
    let saved= await data.save();
    if(!saved ){
        return res.status(400).send({
            success: false,
            error_code:"unknown-error",
            message: "Unknown error occcured try again"
        })
    }

    let response = {
        success: true,
        data: {
            title,
            url,
            slug: final_slug,
            generated_url: base_url+'/'+final_slug,
        }
    }

    return res.status(200).send(response);

}

module.exports=GenerateUrlRoute;