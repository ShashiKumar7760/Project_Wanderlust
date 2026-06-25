const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const {listing,reviewSchema} = require('../schema.js');
const {isloggedIn,isOwner} = require('../middleware.js');
const {validatelisting} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});


router.route('/')
.get(listingController.index) // INDEX
.post(isloggedIn,upload.single("image[url]"),validatelisting,listingController.createListing);  // Add (GET FORM AND POST)



// Add (GET FORM AND POST)
router.get("/new",isloggedIn,listingController.newForm);


router.route('/:id')
.get(listingController.showListing)  // SHOW
.put(isloggedIn,isOwner,upload.single("image[url]"),listingController.updateListing)
.delete(isloggedIn,isOwner,listingController.deleteListing)    // Delete  AND (HANDLING REVIEWS ALSO HANDLING DELETION)


// UPDATE 
router.get("/:id/edit",isloggedIn,isOwner,validatelisting,listingController.formupdateListing);

module.exports = router;