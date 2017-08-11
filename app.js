const fs = require('fs');
const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const userRoutes = require('./routes/userroutes');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('express-flash-messages');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const UserModel = require('./models/users')

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(express.static(path.join(__dirname, 'static')));



passport.use(new LocalStrategy(
	function(username, password, done){
		UserModel.authenticate(username, password, function(error, user){
			if(error){
				return done(error, false);
			}
			else if(user){
			return done(null, user);
			}
			else{
			return done(null, false, {
			message: "There is no such robot with that username and password."
			})
		}
	})
}));


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    UserModel.findOne({_id: id}, function(err, user) {
        done(err, user);
    });
});


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator());


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new(require('express-sessions'))({
        storage: 'mongodb',
        // instance: mongoose, // optional
        // host: 'localhost', // optional
        // port: 27017, // optional
        // db: 'linkedIn4Bots', // optional
        // collection: 'users', // optional
        // expire: 86400 // optional
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})


app.use('/', userRoutes);


app.get('/login', function(req, res, next){
	res.render('login');
});


app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}))

app.get('/registration', function(req, res) {
    res.render('registration');
});


app.post('/registration', function(req, res) {
    req.checkBody('username', 'Username must be alphanumeric').isAlphanumeric();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    req.getValidationResult()
        .then(function(result) {
            if (!result.isEmpty()) {
                return res.render("registration", {
                    username: req.body.username,
                    errors: result.mapped()
                });
            }
            const user = new UserModel({
                username: req.body.username,
                password: req.body.password,
                avatar: req.body.avatar,
                name: req.body.name,
                email: req.body.email,
                university: req.body.university,
                job: req.body.job,
                company: req.body.company,
                skills: [req.body.skills],
                phone: req.body.phone,
                address: {
                	street_num: req.body.street_num,
                	street_name: req.body.street_name,
                	city: req.body.city,
                	state_or_province: req.body.state_or_province,
                	postal_code: req.body.postal_code,
                	country: req.body.country
                }
            })

            const error = user.validateSync();
            if (error) {
                return res.render("registration", {
                    errors: normalizeMongooseErrors(error.errors)
                })
            }

            user.save(function(err) {
                if (err) {
                    return res.render("registration", {
                        messages: {
                            error: ["That username is already taken."]
                        }
                    })
                }
                return res.redirect('/');
            })
        })
});


function normalizeMongooseErrors(errors) {
    Object.keys(errors).forEach(function(key) {
        errors[key].message = errors[key].msg;
        errors[key].param = errors[key].path;
    });
}

app.get('/logout/', function(req, res) {
    req.logout();
    res.redirect('/');
});

const requireLogin = function (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login/');
  }
}

app.get('/secret/', requireLogin, function (req, res) {
  res.render("secret");
})



app.get('/edit/:username', requireLogin, function(req, res, next){

	var username = req.params.username
	var query = {"username": username}


	UserModel.findOne(query)
	.then(function(data){
		res.render("edituser", data)
	})
	.catch(function(error){
		res.render("edituser")
		console.log("error", error)
	})

})


app.post('/submit/:username', function( req, res, next){
	userData = {}

	userData.username = req.body.username
    userData.password =req.body.password
    userData.avatar = req.body.avatar
    userData.name = req.body.name
    userData.email = req.body.email
    userData.university = req.body.university
    userData.job = req.body.job
    userData.company = req.body.company
    userData.skills = [req.body.skills]
    userData.phone = req.body.phone
    
    userData.address = {}
    
    userData.address.street_num = req.body.street_num
    userData.address.street_name = req.body.street_name
    userData.address.city = req.body.city
    userData.address.state_or_province = req.body.state_or_province
    userData.address.postal_code = req.body.postal_code
    userData.address.country = req.body.country
	
	var query = {'username': userData.username}


	UserModel.findOne(query)
		.then(function(data){
			data.username = userData.username
			data.password = userData.password
			data.avatar = userData.avatar
			data.name = userData.name
			data.email = userData.email
			data.university = userData.university
			data.job = userData.job
			data.company = userData.company
			data.skills = userData.skills
			data.phone = userData.phone
			data.address = userData.address


		data.save()
		.then(function(savedData){
		res.redirect("/")	
		})
	})
})





app.listen(3000, function(){
  console.log("App running on port 3000")
})