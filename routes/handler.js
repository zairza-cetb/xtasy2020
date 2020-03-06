var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    User = require('../model/users'),
    nodemailer =require("nodemailer"),
    ResetRequest = require('../model/resetRequest'),
    ejs = require('ejs'),
    path = require("path"),
    router = express.Router();

mongoose.connect("mongodb+srv://zairzacetb:arpanet123@cluster0-coz0t.mongodb.net/test", {
    useNewUrlParser: true
});

// Utility to check if a string is a valid event ID
function isValidEventID(value) {
  return (/^\d+$/.test(value)) && (event_json.hasOwnProperty(value));
}

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

const transporter = nodemailer.createTransport({
  service:"Gmail",
  auth:{
  type:"OAuth2",
    user:"xtasy@cet.edu.in",
    clientId: "714535567108-ic2r9blns2uirlr64lrr7tr4022mq8mo.apps.googleusercontent.com",
    clientSecret: "G0McjpXhqA8bXVXwzA6cFpX2",
    refreshToken: "1//045Bwp21sX8s7CgYIARAAGAQSNwF-L9Ira6ArN3KO-0c0ESFKw9Rl_cmg-bftAcgkmDypMXpO01mduoeV958RH9TTsl9gZxijAvE"
  }
});

router.get('/getpaidstatus/:uid', (req, res, next) => {
var res_data = {};
    User.findById(req.params.uid, (err ,document) => {
        if (document.paidstatus == "unpaid") {
            res_data.paid = false
        }
        if (document.paidstatus == "paid") {
            res_data.paid = true
        }
        if (err) {
            res_data.err = err;
        }
        res.send(JSON.stringify(res_data));
    })
}); 

router.get('/togglepaidstatus/:uid', (req, res, next) => {
    User.findById(req.params.uid, (err, doc) => {
        if (err) {
            res.statusCode = 500;
            res.end();
        } else {
        if (doc.paidstatus === "unpaid") {
            doc.paidstatus = "paid"
        }else {
            doc.paidstatus = "unpaid"
        }
        doc.save((err) => {
            if (err) {
                res.statusCode = 500;
                res.end();
            } else {
                res.send("OK");
            }
        });
        }
    });
});

router.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        gender: req.body.gender,
        phone: req.body.phone,
        college: req.body.college
      });
    User.register(newUser, req.body.password, (err, user) => {
        if(err) return res.redirect(`/register?err=${err.message}`);
                
        passport.authenticate("local")(req, res, () => {
          ejs.renderFile(__dirname+"/mailTemplate.ejs", { name: req.user.name, uid: req.user.uid }, (err, data) => {
            if (err) {
              console.log(err)
            }
            // res.locals.message = "Registered successfully";
            transporter.sendMail({
              from: 'Xtasy 2020 Team, CETB',
              to: req.user.username,
              subject: 'Xtasy 2020 | Registration Successful',
              attachments: [
                {
                  filename: "xtasy.jpg",
                  path: path.join(__dirname, "..", "/public/images/xtasy.jpg"),
                  cid:"logo"
                }
              ],
              html: data
            }, function(error, info){
              if (error) {
                console.log("mail error",error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          })
            if (req.query.ref) {
                res.redirect(`${req.query.ref}?registerSuccess=1`);
              } else {
                res.redirect('/?registerSuccess=1');
              }
        });
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
         return console.log(err); 
        }
      if (!user) {
         return res.redirect(`/login?err=${info.message}`); 
        }
        // console.log('hash',user.getHash());
      req.logIn(user, function(err) {
        if (err) {
           return console.log(err); 
        } else {
          // res.locals.message = `Welcome ${user.name}`;
          if (req.query.ref) {
            return res.redirect(`${req.query.ref}?loginSuccess=1`);
          } else {
            res.redirect('/?loginSuccess=1');
          }
        }
      });
    })(req, res, next);
  });
  

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/?logoutSuccess=1");
});


  // Forgot password form posts here with username(email address) and phone number in body
  router.post('/forgotpassword', (req, res) => {
    User.findOne({
      username: req.body.username,
      phone: req.body.phone,
    }, (err, user) => {
      let message;
      if (err) {
        message = "Sorry, There seems to be a problem at our end";
        if (req.query.ref) {
          res.redirect(`/login?ref=${req.query.ref}&err=${message}`);
        } else {
          res.redirect(`/login?err=${message}&ref=`);
        }
      } else if (!user) {
        message = "An account with the given credentials does not exist";
        if (req.query.ref) {
          res.redirect(`/login?ref=${req.query.ref}&err=${message}`);
        } else {
          res.redirect(`/login?err=${message}&ref=`);
        }
      } else {
        // create a new password reset request
        const resetRequest = new ResetRequest({
          r_id: user._id,
        });

        // save the request to the database
        resetRequest.save((err, request) => {
          if (err) {
            message = "Sorry, There seems to be a problem at our end";
            if (req.query.ref) {
              res.redirect(`/login?ref=${req.query.ref}&err=${message}`);
            } else {
              res.redirect(`/login?err=${message}&ref=`);
            }
            return;
          }

          // Send an E-Mail with a password reset link with id of the request
          transporter.sendMail({
            from: 'Xtasy 2020 Team, CETB',
            to: user.username,
            subject: 'Xtasy 2020 | Password reset',
            text: `Hi, ${user.name}\t\nWe received a request to reset your Xtasy 2020 password. If this wasn't you, you can safely ignore this email, otherwise please go to the following link to reset your password:\nhttps://xtasy.cet.edu.in/resetpassword/${resetRequest._id}\n\nThe Xtasy 2020 Team`,
          }, function (error, info) {
            if (error) {
              message = "Sorry, There seems to be a problem at our end";
              if (req.query.ref) {
                res.redirect(`/login?ref=${req.query.ref}&err=${message}`);
              } else {
                res.redirect(`/login?err=${message}&ref=`);
              }
            } else {
              message = "Please check your E-Mail (also check your spam folder) for instructions on how to reset your password";
              if (req.query.ref) {
                res.redirect(`/login?ref=${req.query.ref}&message=${message}`);
              } else {
                res.redirect(`/login?message=${message}&ref=`);
              }
            }
          });
        });
      }
    });
  });

  // Reset password form posts here with new password
  router.post('/resetpassword/:resetRequestID', function(req, res, next) {
    ResetRequest.findByIdAndDelete(req.params.resetRequestID, function(requestError, resetRequest) {
      if (requestError || !resetRequest) {
        if (req.query.ref) {
          res.redirect(`/login?ref=${req.query.ref}&err=Invalid password reset link, Please go to Forgot Password to request another link`);
        } else {
          res.redirect('/login?err=Invalid password reset link, Please go to Forgot Password to request another link&ref=');
        }
      } else {
        User.findById(resetRequest.r_id, function(userError, user) {
          user.setPassword(req.body.password, function(hashingError, updatedUser) {
            if (hashingError || !updatedUser) {
              if (req.query.ref) {
                res.redirect(`/login?ref=${req.query.ref}&err=Sorry, There seems to be a problem at our end`);
              } else {
                res.redirect('/login?err=Sorry, There seems to be a problem at our end&ref=');
              }
            } else {
              updatedUser.save()
              .then(() => {
                if (req.query.ref) {
                  res.redirect(`/login?ref=${req.query.ref}&message=Your password has been successfully reset. Please login to continue`);
                } else {
                  res.redirect('/login?message=Your password has been successfully reset. Please login to continue&ref=');
                }
              })
              .catch(saveError => {
                if (req.query.ref) {
                  res.redirect(`/login?ref=${req.query.ref}&err=Sorry, There seems to be a problem at our end`);
                } else {
                  res.redirect('/login?err=Sorry, There seems to be a problem at our end&ref=');
                }
              });
            }
          });
        });
      }
    });
  });

/////////////////////////////////////////////////////////////////

/* Backend for event registration */
router.get('/register/:eventID', (req, res) => {
    // Checks if the eventID is a valid event ID
    if (isValidEventID(req.params.eventID)) {
      User.findOne({ _id: req.user._id }, (err, user) => {
        user.events.push(req.params.eventID)
        user.save((err, data) => {
          if (err) {
            console.log(err);
            res.send("F");
          }
          else {
            res.send("T");
          }
        });
      });
    } else {
      res.statusCode = 500;
      res.send('F');
    }
  });
  
  router.get('/chregister/:eventID', (req, res) => {
    // Checks if the eventID is a valid event ID
    if (isValidEventID(req.params.eventID)) {
      var ID = req.params.eventID;
      User.findOne({ _id: req.user._id }, (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send('F');
        }
        else {
  
          let found = user.events.includes(ID);
          if (found)
            res.send("T");
          else
            res.send("F");
        }
      });
    } else {
      res.statusCode = 500;
      res.send('F');
    }
  });
  
  router.get('/unregister/:eventID', (req, res) => {
    // Checks if the eventID is a valid event ID
    if (isValidEventID(req.params.eventID)) {
      User.findOne({ _id: req.user._id }, (err, user) => {
        user.events.pull(req.params.eventID)
        user.save((err, data) => {
          if (err) {
            res.statusCode = 500;
            res.send("F");
          }
          else {
            res.send("T");
          }
        });
      });
    } else {
      res.statusCode = 500;
      res.send('F');
    }
  });
  
///////////////////////////////////////////////////////////

module.exports = router;