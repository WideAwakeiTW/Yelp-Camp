var express = require("express");
var router = express.Router();
var User = require("../models/users");
var passport = require("passport");



router.get("/", function(req, res) {
    res.render("home");
});


router.get("/login", function(req, res) {
    res.render("./authorization/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You are now logged out!");
    res.redirect("/");
});



router.get("/register", function(req, res) {
    res.render("./authorization/register");
});

router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Your are now registered as " + req.user.username)
            res.redirect("/campgrounds");
        });
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in first!")
    res.redirect("/login");
}
module.exports = router;
