var mongoose = require('mongoose');
var Campground = require("./models/campgrounds");

var data = [{
    name: "Long Lake",
    image: "https://www.mindmeister.com/images/download/3047364",
    description: "Rustic camping along mountain ridge. Water, picnic table and fire ring."
}, {
    name: "Fishcreek",
    image: "http://www.wildnatureimages.com/images%203/060731-346..jpg",
    description: "Beautiful views. No facilities. Dispursed camping only",
}, {
    name: "Bison Ridge",
    image: "https://visitidaho.org/content/uploads/2015/09/Swan-Falls-Snake-River-Proper-Camping_CROP.jpg",
    description: "great car camping facilities. Nice large bathrooms and 4 showers. Spacious wooded sites.",
}];

function seedDB() {
    Campground.remove({}, function(err, seed) {
        if (err) {
            console.log(err);
        }
        else {
            data.forEach(function(seed) {
                Campground.create(seed, function(err, seed) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(seed);
                    }
                });
            });
        }
    });
}
module.exports = seedDB;
