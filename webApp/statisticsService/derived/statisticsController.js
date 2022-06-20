const Controller = require('../base/baseController.js');
const { StatusCodes } = require('http-status-codes');
const fetch = require("node-fetch");
const db = require('./db.js');
var controller = new Controller();


controller.route("GET", "/ticketsChart", (req, res) => {
    let days = [];
    let daysClone = [];
    let ticketsSubmitted = {};
    let ticketsSolved = {};
    let now = new Date();

    for(let i = 0; i < 7; i++){
        let stringNow = now.toISOString().split('T')[0];
        now.setDate(now.getDate() - 1);
        days.push(stringNow);
    }

    let solve = (err, results, date) => {
        ticketsSolved[date] = results.rows[0].count;
        if(daysClone.length == 0){
            console.log(ticketsSolved);
            let chart = {
                type : 'line',
                data: {
                    labels: Object.keys(ticketsSubmitted),
                    datasets: [
                        {
                            label: 'Active',
                            data: Object.values(ticketsSubmitted),
                            backgroundColor: '#e46436',
                            borderColor: '#ff893c'
                        },
                        {
                            label: 'Solved',
                            data: Object.values(ticketsSolved),
                            backgroundColor: '#626bc3',
                            borderColor: '#808bff'
                        }]
                },
                options: {}
            }
            return res.json(chart).end();
        }
        db.getTicketsSolvedOnDate(daysClone.pop(), solve);
    }

    let add = (err, results, date) => {
        ticketsSubmitted[date] = results.rows[0].count;
        daysClone.push(date);
        if(days.length == 0){
            console.log(ticketsSubmitted);
            db.getTicketsSolvedOnDate(daysClone.pop(), solve);
            return;
        }
        db.getTicketsSubmittedBeforeDate(days.pop(), add);
    }
    db.getTicketsSubmittedBeforeDate(days.pop(), add);
});

controller.route("GET", "api/statistics/ticket" , async (req, res) => {
    console.log(req.cookies.token);
    console.log(req.query.ticketid);
    let ticket = await fetch(`http://localhost:8081/api/tickets/ticket?ticketid=${req.query.ticketid}`, { headers: {'Cookie' : 'token=' + req.cookies.token} }).then(res => res.json());
    let location = await fetch(`http://localhost:8081/api/locations/location?locationid=${ticket.locationid}`, { headers: {'Cookie' : 'token=' + req.cookies.token} }).then(res => res.json());
    console.log(ticket);
    console.log(location);

    let chart = {
        type: 'bar',
        data: {
            labels: ['Paper,', 'Plastic', 'Metal', 'Glass', 'Oraganic'],
            datasets: [{
                label: location.str,
                data: [ticket.paper, ticket.plastic, ticket.metal, ticket.glass, ticket.organic],
                backgroundColor: '#e46436',
                borderColor: '#ff893c'
            }]
        },
        options: {}
    }
    res.json(chart).end();
});

module.exports = controller;