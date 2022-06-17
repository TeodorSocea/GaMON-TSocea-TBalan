const Controller = require('../base/baseController.js');
const { StatusCodes } = require('http-status-codes');
const Mime = require('../base/httpTypes.js');
var controller = new Controller();

controller.route("GET", "/locations", (req, res) =>{
    console.log(req.query.lat, req.query.long);
    // closeLocations = db.getCloseLocations(req.query.lat, req.query.long)
    var closeLocations =
        [
            {
                id : -1,
                str: "select a location"
            },
            {
                id : 1,
                str : "magura",
                lat : 0,
                long : 0
            },
            {
                id : 2,
                str: "pacurari",
                lat : 0,
                long : 0
            }
        ]
    res.json(closeLocations).end();
});

controller.route("GET", "/location", (req, res) =>{
    // locationTags = db.getLocationTags(req.query.id)
    console.log(req.query.id);
    var locationTags = [
        "glass",
        "metal",
        "paper",
        "organic",
        "plastic"
    ];
    res.json(locationTags).end();
});

module.exports = controller;