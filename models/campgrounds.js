var mongoose = require("mongoose");


var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
});

module.exports = mongoose.model("Campground", campgroundSchema);
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
