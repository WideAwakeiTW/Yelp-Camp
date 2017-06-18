var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");
var Comment = require("./models/comments");
var expressSession = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/users");

mongoose.connect('mongodb://localhost/yelp_camp');



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use(expressSession({
    secret: "dream of pergamum",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


seedDB();

app.get("/", function(req, res) {
    res.render("home");
});

//==========
// INDEX
//==========
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("./campgrounds/index", {
                campgrounds: campgrounds
            });
        }
    });
});
//===========
//NEW ROUTE
//=============
app.get("/campgrounds/new", function(req, res) {
    res.render("./campgrounds/new");
});
app.post("/campgrounds", function(req, res) {
    var newname = req.body.name;
    var newimg = req.body.image;
    var newdesc = req.body.description;
    Campground.create({
        name: newname,
        image: newimg,
        description: newdesc
    }, function(err, campground) {
        if (err) {
            console.log(err);

        }
        else {
            res.redirect("/campgrounds");
        }
    });
});
//=====================
//SHOW ROUTE
//=====================
//show more details on individual campground
app.get("/campgrounds/:id", function(req, res) {
    var id = req.params.id;
    //retrieve item in DB using ID
    Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("./campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});
//===================
// NEW COMMENTS ROUTE
// ==================
app.get("/campgrounds/:id/comments/new", ensureAuthenticated, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("./comments/new", {
                campground: foundCampground
            });
        }
    });
});

//============
//COMMENTS CREATE ROUTE
//================
app.post("/campgrounds/:id/comments", ensureAuthenticated, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//======================
//AUTH ROUTES
//======================
app.get("/register", function(req, res) {
    res.render("./authorization/register");
});

app.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

//================
//LOGIN ROUTES
//================
app.get("/login", function(req, res) {
    res.render("./authorization/login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP);
