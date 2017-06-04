// app/routes.js

// grab the models we just created
var User = require('./models/user.js');

module.exports = function(app, passport) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes
        var Mongoose = require('mongoose');
        var ObjectId = Mongoose.Types.ObjectId; 
        var jwt         = require('jwt-simple');
        var passport       = require('passport');
        
        app.get('/api', function (req, res) {
          res.send('API Version 1.0 is running');
        });
        
        
        //-=======================User Register API------------===============================
        app.post('/api/register', function(req, res) {
            if (!req.body.username || !req.body.password) {
              res.json({success: false, msg: 'Please enter name and password.'});
            } else {
              var newUser = new User({
                name: req.body.username,
                password: req.body.password
              });
              // save the user
              newUser.save(function(err) {
                if (err) {
                  return res.json({success: false, msg: 'Username already exists.'});
                }
                res.json({success: true, msg: 'Successful created new user.'});
              });
            }
          });
          //=====================================================================================
          // route to authenticate a user (POST http://localhost:8080/api/authenticate)
          app.post('/api/authenticate', function(req, res) {
            User.findOne({
              name: req.body.name
            }, function(err, user) {
              if (err) throw err;
           
              if (!user) {
                res.send({success: false, msg: 'Authentication failed. User not found.'});
              } else {
                // check if password matches
                user.comparePassword(req.body.password, function (err, isMatch) {
                  if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                  } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                  }
                });
              }
            });
          });
          
          
          //======================================================================
          //==============Get login User----------------------------------------
          //=================================================================================
          app.get('/api/user',function(req, res) {
            
            if(req.user)
            {
              res.json(req.user );
              //console.log(req.user.displayName); 
            }
          });
          // =====================================
          // HOME PAGE (with login links) ========
          // =====================================
          app.get('/', function(req, res) {
              res.sendfile('./client/index.html'); // load the index.html file
          });

          // =====================================
        	// LOGIN ===============================
        	// =====================================
        	// show the login form
        	app.get('/login', function(req, res) {
        
        		// render the page and pass in any flash data if it exists
        		res.sendfile('./client/login.html', { message: req.flash('loginMessage') });
        	});
        
        	// process the login form
        	app.post('/login', passport.authenticate('local-login', {
        		successRedirect : '/home', // redirect to the secure profile section
        		failureRedirect : '/login', // redirect back to the signup page if there is an error
        		failureFlash : true // allow flash messages
        	}));
          /*
          app.post('/login', function(req, res, next) {
          passport.authenticate('local-login', function(err, user, info) {
            if (err) {
              return next(err); // will generate a 500 error
            }
            // Generate a JSON response reflecting authentication status
            if (! user) {
              return res.send(401,{ success : false, message : 'authentication failed' });
            }
            req.login(user, function(err){
              if(err){
                return next(err);
              }
              res.redirect('/home');
              return res.send({ success : true, message : 'authentication succeeded' });
              
            });
            })(req, res, next);
          });*/
        	// =====================================
        	// SIGNUP ==============================
        	// =====================================
        	// show the signup form
        	app.get('/signup', function(req, res) {
        
        		// render the page and pass in any flash data if it exists
        		res.sendfile('./client/register.html', { message: req.flash('signupMessage') });
        	});
        
        	// process the signup form
        	app.post('/signup', passport.authenticate('local-signup', {
        		successRedirect : '/profile', // redirect to the secure profile section
        		failureRedirect : '/signup', // redirect back to the signup page if there is an error
        		failureFlash : true // allow flash messages
        	}));
        
        	// =====================================
        	// PROFILE SECTION =========================
        	// =====================================
        	// we will want this protected so you have to be logged in to visit
        	// we will use route middleware to verify this (the isLoggedIn function)
        	app.get('/profile', isLoggedIn, function(req, res) {
        		res.sendfile('./client/profile.html', {
        			user : req.user // get the user out of session and pass to template
        		});
        	});
        	// =====================================
        	// MAIN ADMIN SECTION =========================
        	// =====================================
        	// we will want this protected so you have to be logged in to visit
        	// we will use route middleware to verify this (the isLoggedIn function)
        	app.get('/home', isLoggedIn, function(req, res) {
        		res.sendfile('./client/my-account.html', {
        			user : req.user // get the user out of session and pass to template
        		});
        	});
        	// =====================================
          // Contact PAGE (with login links) ========
          // =====================================
          app.get('/contact', function(req, res) {
              res.sendfile('./client/contact.html'); // load the index.html file
          });
          // =====================================
          // Partner PAGE (with login links) ========
          // =====================================
          app.get('/partner', function(req, res) {
              res.sendfile('./client/taxi.html'); // load the index.html file
          });
          // =====================================
          // Agent PAGE (with login links) ========
          // =====================================
          app.get('/agent', function(req, res) {
              res.sendfile('./client/private-driver.html'); // load the index.html file
          });
          // =====================================
          // FACEBOOK ROUTES =====================
          // =====================================
          // route for facebook authentication and login
          app.get('/auth/facebook', passport.authenticate('facebook', { authType: 'rerequest', scope : 'email' }));
      
          // handle the callback after facebook has authenticated the user
          app.get('/auth/facebook/callback',
              passport.authenticate('facebook', {
                  successRedirect : '/home',
                  failureRedirect : '/login'
              }));
              
          // =====================================
          // GOOGLE ROUTES =======================
          // =====================================
          // send to google to do the authentication
          // profile gets us their basic information including their name
          // email gets their emails
          app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
      
          // the callback after google has authenticated the user
          app.get('/auth/google/callback',
                  passport.authenticate('google', {
                          successRedirect : '/home',
                          failureRedirect : '/login'
                  }));
      
          //};

      
          // route for logging out
          app.get('/logout', function(req, res) {
              req.logout();
              res.redirect('/login');
          });
          
          // route middleware to make sure
          function isLoggedIn(req, res, next) {
          
          	// if user is authenticated in the session, carry on
          	if (req.isAuthenticated())
          		return next();
          
          	// if they aren't redirect them to the home page
          	res.redirect('/login');
          }
          
          
          //=========================================================================================================
        
        
        /* GET /Agent listing. */
        
        /* POST /todos */
        app.post('/api/kpi', function(req, res, next) {
          User.create(req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* GET /todos/id */
        app.get('/api/kpi/:id', function(req, res, next) {
          User.findById(req.params.id, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* PUT /todos/:id */
        app.put('/api/kpi/:id', function(req, res, next) {
          User.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        // route to handle delete goes here (app.delete)
        /* DELETE /todos/:id */
        app.delete('/api/kpi/:id', function(req, res, next) {
          User.findByIdAndRemove(req.params.id, req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
       
       

        // frontend routes =========================================================
        // route to handle all angular requests
      /*  app.get('*', function(req, res) {
            res.sendfile('./client/index.html'); // load our public/index.html file
        });
       */ 
    };
