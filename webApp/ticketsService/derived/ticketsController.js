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
    var ok = false;
    for(let i = 0; i < Object.keys(req.body.quantities).length; i++){
        let quantity = Object.keys(req.body.quantities)[i];
        ticket[quantity] = Number(req.body.quantities[quantity]);
        console.log(ticket[quantity])
        if(ticket[quantity] > 0){
            ok = true;
        }
    }
    const {error, value} = schemas.ticketSchema.validateTicket(ticket);
    if (error || ok === false)
        return res.status(StatusCodes.BAD_REQUEST).end(error.toString());

    //db.addTicket(value);
    res.end();
});

controller.route("GET", "/topTickets", (req, res) =>{
    let top = req.query.top;
    //db.getTopTickets(top)
    topTickets = [
        {
            submitterID : 0,
            locationID : 0,
            dateSubmitted: '2022-06-16',
            dateSolved: '',
            paper: 0,
            plastic: 0,
            metal: 1,
            glass: 1,
            organic:1,
            comment: "please come pick up trash",
            active: 'true'
        },
        {
            submitterID : 1,
            locationID : 1,
            dateSubmitted: '2022-06-16',
            dateSolved: '',
            paper: 1,
            plastic: 0,
            metal: 0,
            glass: 0,
            organic:1,
            comment: "angry >:(",
            active: 'true'
        },
        {
            submitterID : 2,
            locationID : 2,
            dateSubmitted: '2022-06-16',
            dateSolved: '',
            paper: 1,
            plastic: 1,
            metal: 1,
            glass: 1,
            organic:1,
            comment: "I have all",
            active: 'true'
        },
        {
            submitterID : 1,
            locationID : 1,
            dateSubmitted: '2022-06-16',
            dateSolved: '',
            paper: 1,
            plastic: 0,
            metal: 0,
            glass: 0,
            organic:1,
            comment: "angry >:(",
            active: 'true'
        },
        {
            submitterID : 1,
            locationID : 1,
            dateSubmitted: '2022-06-16',
            dateSolved: '',
            paper: 1,
            plastic: 0,
            metal: 0,
            glass: 0,
            organic:1,
            comment: "angry >:(",
            active: 'true'
        }
    ];
    res.json(topTickets).end();
});

module.exports = controller;