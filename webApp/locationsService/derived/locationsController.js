const Controller = require('../base/baseController.js');
const { StatusCodes } = require('http-status-codes');
const Mime = require('../base/httpTypes.js');
const db = require('./db.js');
const schemas = require('../schemas');
const fetch = require("node-fetch");
const CsvParser = require("json2csv").Parser;

var controller = new Controller();

function distance(lat1,
    lon1, lat2, lon2)
{

// The math module contains a function
// named toRadians which converts from
// degrees to radians.
lon1 =  lon1 * Math.PI / 180;
lon2 = lon2 * Math.PI / 180;
lat1 = lat1 * Math.PI / 180;
lat2 = lat2 * Math.PI / 180;

// Haversine formula
let dlon = lon2 - lon1;
let dlat = lat2 - lat1;
let a = Math.pow(Math.sin(dlat / 2), 2)
+ Math.cos(lat1) * Math.cos(lat2)
* Math.pow(Math.sin(dlon / 2),2);

let c = 2 * Math.asin(Math.sqrt(a));

// Radius of earth in kilometers. Use 3956
// for miles
let r = 6371;

// calculate the result
return(c * r);
}

controller.route("GET", "/api/locations/closeLocations", (req, res) =>{
    db.getAllLocations((err, results) => {
        results = results.rows;
        let closeLocations = [{
            id : -1,
            str: "select a location"
        }];
        if(results.length === 0)
            return res.json({}).end();
        for(let i = 0; i < results.length; i++){
            if(results[i].active === 'true')
                if(distance(req.query.lat, req.query.long, results[i].lat, results[i].long) < 2)
                    closeLocations.push(results[i]);
        }
        return res.json(closeLocations).end();
    });
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

controller.route("PUT", "/api/locations/updateLocation", (req, res) => {
    db.getLocationById(req.query.locationid, (error, results) => {
        results = results.rows[0];
        console.log(results);
        if(results.active === 'true')
            db.updateLocation(req.query.locationid, 'false', (error, results) => {
                return res.end();
            });
        else
            db.updateLocation(req.query.locationid, 'true', (error, results) => {
                return res.end();
            });
    });
});

controller.route("GET", "/api/locations/export", async (req, res) => {
    db.getAllLocations( async (err, results) =>{
        results = results.rows;
        for(let i = 0; i < results.length; i++){
            let statistics = await fetch(`http://localhost:8081/api/statistics/location?locationid=${results[i].id}`, { headers: {'Cookie' : 'token=' + req.cookies.token} }).then(statistics => statistics.json());
            results[i]['statistics'] = {
                Paper: statistics.data.datasets[0].data[0],
                Plastic: statistics.data.datasets[0].data[1],
                Metal: statistics.data.datasets[0].data[2],
                Glass: statistics.data.datasets[0].data[3],
                Organic: statistics.data.datasets[0].data[4],
            }
        }
        const csvParser = new CsvParser();
        const csvData = csvParser.parse(results);
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Disposition", "attachment; filename=locations.csv");
        return res.status(200).end(csvData);
    });
});

module.exports = controller;