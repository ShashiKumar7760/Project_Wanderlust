const User = require('../models/user.js');

module.exports.getSignupForm = (req,res) =>{
    res.render('users/signup.ejs')
}

module.exports.createSignup = async(req,res,next) => {
    try{
        let {username,email,password} = req.body;
    let newuser = new User({username, email});
    let registeredUser = await User.register(newuser, password);

    req.login(registeredUser, (error)=>{
        if(error){
            return next(err);
        }
        req.flash("success" , "Welcome to Wanderlist");
       res.redirect('/listings');
    });

   
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect('/signup');
    }
    
}

module.exports.getLoginForm =(req,res) =>{
    res.render('users/login.ejs')
}

module.exports.createLogin = async(req,res) => {
   req.flash("success", "Welcome back to Wanderlust");
   let redirect = res.locals.saveurl || '/listings'
   res.redirect(redirect);
}

module.exports.logout = (req,res,next) => {
    req.logout((err) =>{
        if(err){
            return next(err);
        }
    })
    req.flash("success","You Log out ");
    res.redirect('/listings');
}
