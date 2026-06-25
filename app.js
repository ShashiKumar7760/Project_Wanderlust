if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const asyncWrap = require('./utils/WrapAsync.js');
const session = require('express-session');
const MongoStore = require("connect-mongo").default;
const flash = require('connect-flash');
const User = require('./models/user.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const listingRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const app = express();
let port = 8080;
const dburl = process.env.ATLASDB_URL;




app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,'views'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.json());

async function main(){
    await mongoose.connect(dburl);
}
main().then((data) => {
    console.log("Connection Successfull");
}) 
.catch((error) => {
    console.log(error);
})


const passportLocalMongoose = require("passport-local-mongoose");


const store = MongoStore.create({
    mongoUrl: dburl,
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
})

store.on('error', (err)=> {
    console.log("ERROR in MONGO SESSION STORE",err)
})

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}



app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
})


app.listen(port, () => {
    console.log(`App is listening on port : ${port}`);
})

app.use('/listings',listingRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);


// MIDDLEWARE ERROR HANDLING
app.all("/{*any}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next) =>{
    
    let{status = 500, message = "Something went wrong"} = err;
    res.status(status).render('listings/error.ejs',{message})
})