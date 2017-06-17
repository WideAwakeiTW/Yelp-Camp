var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");
var Comment = require("./models/comments");

mongoose.connect('mongodb://localhost/yelp_camp');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));


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
// === === === === === ===
// NEW COMMENTS ROUTE
// ==================
app.get("/campgrounds/:id/comments/new", function(req, res) {
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
app.post("/campgrounds/:id/comments", function(req, res) {
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
app.listen(process.env.PORT, process.env.IP);
