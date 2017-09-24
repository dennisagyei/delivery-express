#!/usr/bin/env nodejs
// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var passport       = require('passport');
var flash          = require('connect-flash');
var session        = require('express-session');

var server          = require('http').Server(app);
var io              = require('socket.io')(server);


// configuration ===========================================



// config files
var db = require('./config/db');
require('./config/passport')(passport); // pass passport for configuration

// set our port 3000 for dev Env
var port = process.env.PORT || 8080; 

// connect to our mongoDB database 
mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/client')); 

// Configuration for passport
//app.use(express.session({ secret: 'mySecretKey' })); // session secret
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ==================================================
require('./app/routes')(app, passport); // load our routes and pass in our app and fully configured passport

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Server listening at ' + port);

// expose app           
exports = module.exports = app;                         

var visitors = {};
io.on('connection', function(socket){
	socket.on('new_user', function(data){
		if(parseInt(Object.keys(visitors).length) > 0)
			socket.emit('already', {visitors: visitors});
		visitors[socket.id] = data.pos;
		io.emit('connected', { pos: data.pos, users_count: Object.keys(visitors).length });
		console.log('someone CONNECTED:');
		console.log(visitors);
	});
	socket.on('disconnect', function(){
		if(visitors[socket.id]){
			var todel = visitors[socket.id];
			delete visitors[socket.id];
			io.emit('disconnected', { del: todel, users_count: Object.keys(visitors).length }); 	
		}
		console.log('someone DISCONNECTED:');
		console.log(visitors);
	});
}); 
