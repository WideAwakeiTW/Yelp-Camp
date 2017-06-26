var middlewareObj = {};
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

middlewareObj.checkCommentAuthorization = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log(err);
            }
            else {
                if (foundComment.author.id.equals(req.user.id)) {
                    next();
                }
                else {
                    req.flash("error", "You are not authorized to perform this action.")
                    res.redirect("back");
                }
            }
        });
    }
    else {
        res.redirect("back");
    }
};

middlewareObj.checkCampgroundAuthorization = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, campground) {
            if (err) {
                res.redirect("back");
            }
            else {
                if (campground.author.id.equals(req.user.id)) {
                    next();
                }
                else {
                    res.send("you are not authorized to view this page");
                }
            }
        });
    }
    else {
        res.redirect("back");
    }
};

middlewareObj.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be signed in!")
    res.redirect("/login");
};

module.exports = middlewareObj;
