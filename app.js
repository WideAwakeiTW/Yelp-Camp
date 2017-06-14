var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");

mongoose.connect('mongodb://localhost/yelp_camp');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


seedDB();

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", {
                campgrounds: campgrounds
            });
        }
    });
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
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

//show more details on individual campground
app.get("/campgrounds/:id", function(req, res) {
    var id = req.params.id;
    //retrieve item in DB using ID
    Campground.findById(id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", {
                campground: foundCampground
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP);
