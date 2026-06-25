const Joi = require('joi');

const listing = Joi.object({
    title : Joi.string().required(),
    description : Joi.string().required(),
    image: Joi.object({
        filename:Joi.string(),
        url: Joi.string().required()
     }),
    price : Joi.number().required().min(0),
    location : Joi.string().required(),
    country : Joi.string().required(),
})

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.string().required().min(1).max(5),
        comments: Joi.string().required()
    }).required()
});

module.exports = {listing,reviewSchema};