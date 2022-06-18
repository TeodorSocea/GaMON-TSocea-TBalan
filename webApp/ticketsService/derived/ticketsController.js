const Controller = require('../base/baseController.js');
const { StatusCodes } = require('http-status-codes');
const Mime = require('../base/httpTypes.js');
const schemas = require('../schemas')
var controller = new Controller();

controller.route("POST", "/ticketSubmit", (req, res) => {
    let ticket = {};
    let username = req.currentUser.username;
    //ticket["submitterID"] = db.getIdFromUsername(username)
    ticket["submitterID"] = 1;
    ticket["locationID"] = req.body.id;
    ticket["comment"] = req.body.comment;
    for(let i = 0; i < Object.keys(req.body.quantities).length; i++){
        let quantity = Object.keys(req.body.quantities)[i];
        ticket[quantity] = Number(req.body.quantities[quantity]);
    }
    const {error, value} = schemas.ticketSchema.validateTicket(ticket);
    if (error)
        return res.status(StatusCodes.BAD_REQUEST).end(error.toString());
    res.end();
});

module.exports = controller;