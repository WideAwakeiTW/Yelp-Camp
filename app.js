var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDB = require("./seeds");
var expressSession = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/users");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
var methodOverride = require("method-override");
var flash = require("connect-flash");
mongoose.connect('mongodb://errordrivendev:7codeBaker@ds139082.mlab.com:39082/hart_yelp_camp');

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
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(methodOverride("_method"));
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

// seedDB();
//info is stored at req.user coming into route and sent out at currentUser
//going to the templates




//https://enigmatic-mountain-74349.herokuapp.com/

app.listen(process.env.PORT, process.env.IP);
