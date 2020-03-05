var express = require('express'),
    mongoose = require('mongoose'),
    User = require('../model/users');
var events_json = require("./event.json");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let message, registered;
	if (req.query.loginSuccess == "1") {
		message = `Welcome, ${req.user.name}`;
	}
	if (req.query.registerSuccess == "1") {
		registered = true;
	}
	if (req.query.logoutSuccess == "1"){
		message = "Successfully logged you out";
	}
    res.render('index', {
		message,
    	registered,
    	title: 'Xtasy'
	});
});


router.get("/coordinator",function(req,res,next) {
	User.find({}, (err, data) => {
		if (err) console.log(err);
		else
		  res.render("enter", { data: data, evjson: events_json });
		});
});

router.post('/status', (req, res) => {
	var msg = req.body.id;
	User.findOne({ uid: msg }, (err, status) => {
		if(err) console.log(err);
		else
			res.render('status', { status: status, evjson: events_json });
	});
});

// GET register page
router.get("/register", function (req, res, next) {
  res.render("register", { err: req.query.err });
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  if(req.user){
		res.redirect("/");
	}else{res.render("login", {
		err: req.query.err,
		message: req.query.message
	});}
});

/* GET resetPassword page. */
router.get("/resetPassword", function (req, res, next) {
  res.render("resetPassword");
});

/*GET admin page*/
router.get('/eventregistration', (req, res) => {
  res.render('adminlog');
});

/* POST admin page. */
router.post("/centralregistration", (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	if(username.hashCode() == -709387849 && password.hashCode() == 1789464955){
	  User.find({}, (err, data) => {
      if (err) console.log(err);
      else
	  	res.render("admin", { data: data, evjson: events_json });
      });
	} else if(username.hashCode() == -1965062827 && password.hashCode() == 1750512007){
		User.find({}, (err, data) => {
		if 
			(err) console.log(err);
		else
			res.render("centralregistration", { data: data, evjson: events_json });
		});
	  } else {
	  res.redirect("/eventregistration");
	}
});

// GET Event Page
router.get('/events', function (req, res, next) {
  let message;
	if (req.query.loginSuccess == "1") {
		message = `Welcome, ${req.user.name}`;
	}
	if (req.query.logoutSuccess == "1"){
		message = "Successfully logged you out";
	}
	res.render('events', { message: message , evjson: events_json });
});

// GET Sponsers Page
router.get('/sponsors', function (req, res, next) {
  res.render('sponsers');
});
// GET Star Page
router.get('/stars', function (req, res, next) {
  res.render('stars')
});
// GET Gallery Page
router.get('/gallery', function (req, res, next) {
  res.render('gallery')
});

/* Hash function */
String.prototype.hashCode = function(){
	var hash = 0;
	 if (this.length == 0) return hash;
	 for (i = 0; i < this.length; i++) {
		 char = this.charCodeAt(i);
		 hash = ((hash<<5)-hash)+char;
		 hash = hash & hash; // Convert to 32bit integer
	 }
	 return hash;
 }

module.exports = router;
