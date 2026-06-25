const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken})

module.exports.index = async(req,res) =>{
    let data = await Listing.find();
    res.render('listings/index.ejs',{data})
}

module.exports.newForm = (req,res)=> {
    res.render('listings/new.ejs');
}

module.exports.createListing = async(req,res) =>{
    
    
    // if (!req.body) {
    //     throw new ExpressError(400, "Send valid data");
    // }       ( INSTEAD OF WRITING THESE (ONE BY ONE DESCRIPTION , COUNTRY) U CAN CALL THE FUNCTION  )

    let url = req.file.path;
    let filename = req.file.filename;
 let { title, description,price,location,country } = req.body;
 console.log(req.body);
  let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit : 1
    }).send()


//  if(!description){
//     throw new ExpressError(400, "Descrition is missing");
//  }

  /// to add owner : req.user._id
  let geometry = response.body.features[0].geometry;
 let data = await Listing.create({
    title,
    description,
    image: {
        url,
        filename
    },
    price,
    location,
    country,
    owner: req.user._id,
    geometry
});

 console.log(data)
 req.flash("success", "New Listing is created") 
 res.redirect('/listings');
}

module.exports.showListing = async(req,res) =>{
    let{id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate :{path:"author"}}).populate('owner');
    if (!listing) {
    req.flash("error","Listing you requested for doesn't exist");
    return res.redirect('/listings');
   }
    res.render('listings/show.ejs',{listing});
}

module.exports.formupdateListing = async(req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
    req.flash("error","Listing you requested for doesn't exist");
    return res.redirect('/listings');
   }
   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace('/upload',"/5upload/h_300,w_250")
    res.render('listings/edit.ejs',{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    let{id} = req.params;
    let user = await Listing.findByIdAndUpdate(id,req.body,{new:true},{runValidators: true})

    let url = req.file.path;
    let filename = req.file.filename;
    user.image = {filename,url};
    await user.save();
     req.flash("success","Listing Updated")
     res.redirect('/listings');
}

module.exports.deleteListing = async(req,res) => {
    let{id} = req.params;
    let user = await Listing.findByIdAndDelete(id);
    console.log(user);
    req.flash("success","Listing Deleted")
    res.redirect('/listings');
}