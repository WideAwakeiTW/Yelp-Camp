var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");



mongoose.connect('mongodb://localhost/yelp_camp');
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

//manual add new campground to DB
// Campground.create({
//     name: "Cades Cove",
//     image: "http://delightedimages.com/wp-content/uploads/2014/12/Delighted-Images_Ilma-and-Sohail_Presidio-Engagment_SocMed_110_0644.jpg",
//     description: "Great Smokey Mountains National Park"
// }, function(err, campground) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("New campground created:");
//         console.log(campground);
//     }
// });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

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
