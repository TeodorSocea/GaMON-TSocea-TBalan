const Controller = require('../base/baseController.js');
const { StatusCodes } = require('http-status-codes');
const Mime = require('../base/httpTypes.js');
const schemas = require('../schemas');
const db = require('./db.js');
var controller = new Controller();

controller.route("POST", "/ticketSubmit", (req, res) => {
    let ticket = {};
    let username = req.currentUser.username;

    db.getIdFromUsername(username, (err, results) => {
        if (err)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.toString());
        else{
            results = results.rows[0];
            ticket["submitterID"] = results.id;
            ticket["locationID"] = req.body.id;
            ticket["comment"] = req.body.comment;
            var ok = false;
            for(let i = 0; i < Object.keys(req.body.quantities).length; i++){
                let quantity = Object.keys(req.body.quantities)[i];
                ticket[quantity] = Number(req.body.quantities[quantity]);
                if(ticket[quantity] > 0){
                    ok = true;
                }
            }
            const {error, value} = schemas.ticketSchema.validateTicket(ticket);
            if (error || ok === false)
                return res.status(StatusCodes.BAD_REQUEST).end(error.toString());

            db.createTicket(value, (err, results) => {
                if(err){
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.toString());
                }
            });
            res.end();
        }
    });
});

controller.route("GET", "/topTickets", (req, res) =>{
    let top = req.query.top;
    db.getTopTickets(top, (err, results) => {
        if(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.toString());
        }
        results = results.rows;

        for(let i = 0; i < results.length; i++){
           results[i].datesubmitted = results[i].datesubmitted.toISOString().split('T')[0] + " " + results[i].datesubmitted.toISOString().split('T')[1].split('.')[0];
        }
        console.log(JSON.stringify(results));
        res.json(results).end();
    }); 
});

module.exports = controller;