const Controller = require('../base/baseController.js');
const { StatusCodes } = require('http-status-codes');
const Mime = require('../base/httpTypes.js');
const db = require('./db.js');
const schemas = require('../schemas');
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
                lat : 47.17,
                long : 27.67
            },
            {
                id : 2,
                str: "pacurari",
                lat : 47.07,
                long : 27.67
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

controller.route("GET", "/api/locations/location", (req, res) => {
    let id = req.query.locationid;
    console.log(id);
    db.getLocationById(id, (err, results) => {
        if(results.rows.length === 0){
            return res.json({}).end();
        }
        results = results.rows[0];
        return res.json(results).end();
    });
});

controller.route("GET", "/api/locations/allLocations", (req, res) => {
    db.getAllLocations((err, results) => {
        results = results.rows;
        if(results.length === 0)
            return res.json({}).end();
        return res.json(results).end();
    });
});

controller.route("POST", "/api/locations/addLocation", (req, res) => {
    const {error, value} = schemas.locationSchema.validateLocation(req.body);
    console.log(error);
    if (error)
        return res.status(StatusCodes.BAD_REQUEST).end(error.toString());
    db.addLocation( value , (err, results) => {
        if (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.toString());
        }
        else {
            res.end();
        }
    });
});

module.exports = controller;