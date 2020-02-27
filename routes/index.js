var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Xstasy' });
});
router.get("/register", function (req, res, next) {
  res.render("register", {
    err: req.query.err
  });
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("login");
});

// GET Event Page
router.get('/events', function (req, res, next) {
  res.render('events');
});
// GET Sponsers Page
router.get('/sponsers', function (req, res, next) {
  res.render('sponsers');
});
// GET Star Page
router.get('/stars', function (req, res, next) {
  res.render('star')
});
// GET Gallery Page
router.get('/gallery', function (req, res, next) {
  res.render('gallery')
});

module.exports = router;
