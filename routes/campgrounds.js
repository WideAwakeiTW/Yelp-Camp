var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middlewareObj = require("../middleware");


router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            res.render("./campgrounds/index", {
                campgrounds: campgrounds,
            });
        }
    });
});
//===========
//NEW ROUTE
//=============
router.get("/campgrounds/new", middlewareObj.ensureAuthenticated, function(req, res) {
    res.render("./campgrounds/new");
});
router.post("/campgrounds", middlewareObj.ensureAuthenticated, function(req, res) {

    var newname = req.body.name;
    var newprice = req.body.price;
    var newimg = req.body.image;
    var newdesc = req.body.description;
    var author = {
        id: req.user.id,
        username: req.user.username
    };
    Campground.create({
        name: newname,
        price: newprice,
        image: newimg,
        description: newdesc,
        author: author
    }, function(err, campground) {
        if (err) {
            req.flash("error", err.message);

        }
        else {
            console.log(campground);
            req.flash("success", "Now you can add a campground!")
            res.redirect("/campgrounds");
        }
    });
});

//UPDATE ROUTES
router.get("/campgrounds/:id/edit", middlewareObj.checkCampgroundAuthorization, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            res.render("./campgrounds/edit", {
                campground: foundCampground
            });
        }
    });
});

router.put("/campgrounds/:id", middlewareObj.checkCampgroundAuthorization, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            req.flash("success", "You have successfully updated your campground posting!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//SHOW ROUTE
router.get("/campgrounds/:id", function(req, res) {
    var id = req.params.id;
    //retrieve item in DB using ID
    Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            res.render("./campgrounds/show", {
                campground: foundCampground,
            });
        }
    });
});

//DESTROY ROUTE
router.delete("/campgrounds/:id", middlewareObj.checkCampgroundAuthorization, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, deleted) {
        if (err) {
            req.flash("error", err.message);
        }
        req.flash("success", "Your campground posting has been deleted.")
        res.redirect("/campgrounds");
    });
});

module.exports = router;
