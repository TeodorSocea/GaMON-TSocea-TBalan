const Controller = require('../base/baseController.js');
const { StatusCodes } = require('http-status-codes');
const Mime = require('../base/httpTypes.js');
var controller = new Controller();

controller.route("GET", "/locations", (req, res) =>{
    console.log(req.query.lat, req.query.long);
    // closeLocations = db.getCloseLocations(req.query.lat, req.query.long)
    closeLocations =
        [
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

module.exports = controller;