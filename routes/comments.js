var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middlewareObj = require("../middleware");
//============
//COMMENTS CREATE ROUTE
//================
router.get("/campgrounds/:id/comments/new", middlewareObj.ensureAuthenticated, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            res.render("./comments/new", {
                campground: foundCampground
            });
        }
    });
});


router.post("/campgrounds/:id/comments", middlewareObj.ensureAuthenticated, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", err.message);
                }
                else {
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Your comment has been added!")
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
//=====================
//EDIT COMMENT ROUTE
//=====================
router.get("/campgrounds/:id/comments/:comment_id/edit", middlewareObj.checkCommentAuthorization, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if (err) {
                    req.flash("error", err.message);
                }
                else {
                    res.render("./comments/edit", {
                        campground: foundCampground,
                        comment: foundComment
                    });
                }
            });
        }
    });
});
router.put("/campgrounds/:id/comments/:comment_id", middlewareObj.checkCommentAuthorization, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            req.flash("success", "Your comment has been updated!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
router.delete("/campgrounds/:id/comments/:comment_id", middlewareObj.checkCommentAuthorization, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            req.flash("success", "Your comment has been deleted.")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
