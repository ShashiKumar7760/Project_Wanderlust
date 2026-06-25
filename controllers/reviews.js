const Review = require('../models/review.js')
const Listing = require('../models/listing.js');

module.exports.createReview = async(req,res) => {
    let {id} = req.params;
    let review = req.body.review;

    let data = await Listing.findById(id);
    let newreview = new Review(review);
    data.reviews.push(newreview);
    newreview.author = res.locals.curruser;
    await newreview.save();
    await data.save();

    console.log('Data was saved');
    req.flash("success","New Review Created")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async(req,res) =>{
    let{ id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull :{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`);
}