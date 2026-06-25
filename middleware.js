const Listing = require('./models/listing.js')
const ExpressError = require('./utils/ExpressError.js');
const {listing,reviewSchema} = require('./schema.js')
const Review = require('./models/review.js');

const isloggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirect = req.originalUrl ;
        req.flash("error", "You must be log in")
        return res.redirect("/login");
    }
    next();
}

const saveUrl = (req,res,next) =>{
    res.locals.saveurl = req.session.redirect;
    next();
}

const isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!res.locals.curruser._id.equals(listing.owner._id)){
        req.flash("error","You are not allowed to perform these action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// Review
const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}

// JOI SCHEMA VALIDATION
const validatelisting  = (req,res,next) =>{
    let {error} = listing.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}

const isAuthorOwner = async(req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!res.locals.curruser._id.equals(review.author._id)){
        req.flash("error","You are not allowed to perform these action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = {isloggedIn,saveUrl,isOwner,validateReview,validatelisting,isAuthorOwner};