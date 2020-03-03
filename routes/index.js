var express = require('express'),
    mongoose = require('mongoose'),
    User = require('../model/users');
var events_json = require("./event.json");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Xstasy' });
});

// GET register page
router.get("/register", function (req, res, next) {
  res.render("register");
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("login");
});

/* GET resetPassword page. */
router.get("/resetPassword", function (req, res, next) {
  res.render("resetPassword");
});

// GET Event Page
router.get('/events', function (req, res, next) {
  res.render('events', { evjson: events_json });
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

module.exports = router;
