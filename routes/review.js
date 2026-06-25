const express = require('express');
const router = express.Router({mergeParams:true});
const {validateReview,isloggedIn,isAuthorOwner} = require('../middleware.js')
const reviewController = require('../controllers/reviews.js')


// REVIEWS
//POST
router.post('/',isloggedIn,validateReview,reviewController.createReview);

// DELETE (INDIVIDUAL REVIEW)
router.delete('/:reviewId',isAuthorOwner,reviewController.deleteReview );

module.exports = router;