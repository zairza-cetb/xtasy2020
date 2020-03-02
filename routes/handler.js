var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    User = require('../model/users'),
    router = express.Router();

mongoose.connect("mongodb+srv://zairzacetb:arpanet123@cluster0-coz0t.mongodb.net/test", {
    useNewUrlParser: true
});

router.use(require("express-session")({
    secret: "Secrets shall not be disclosed",
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

//Initialization of passportjs
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(passport.initialize());
router.use(passport.session());

///////////////////////////////////////////////////////////

router.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        gender: req.body.gender,
        phone: req.body.phone,
        college: req.body.college
      });
    User.register(newUser, req.body.password, (err, user) => {
        if(err) 
            console.log(err)
                
        passport.authenticate("local")(req, res, () => {
            res.redirect("/");
        });
    });
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login'
    }
));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

///////////////////////////////////////////////////////////

module.exports = router;