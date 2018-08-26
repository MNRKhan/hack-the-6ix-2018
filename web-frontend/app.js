require('dotenv').config();

const express 		= require("express"),
	  app 			= express(),
	  bodyparser	= require("body-parser");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +'/public'));

var currentUser; 	// Current User.
// Using our Google Maps API key.
app.use(function(req, res, next){
	res.locals.GM_API_KEY	= process.env.GM_API_KEY;
	res.locals.currentUser	= currentUser;
	next();
});

app.get('/', function(req, res){
    res.render("landing");
});

app.get('/dashboard', isLoggedIn, function(req, res){
    res.render("index");
});

app.post('/login', function(req, res) {
	currentUser = req.body.caretaker;
	res.redirect('/dashboard');
});

function isLoggedIn(req, res, next) {
	if(currentUser) next();
	else res.redirect('/');
}

app.listen(3000, function(){
	console.log("App Started!");
});