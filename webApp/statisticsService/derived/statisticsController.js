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
            daysClone.reverse();
            db.getTicketsSolvedOnDate(daysClone.pop(), solve);
            return;
        }
        db.getTicketsSubmittedBeforeDate(days.pop(), add);
    }
    db.getTicketsSubmittedBeforeDate(days.pop(), add);
});

controller.route("GET", "/trashChart", async (req, res) => {
    let response = await fetch(`http://localhost:8081/api/tickets/solvedTickets`, {headers: {'Cookie': 'token=' + req.cookies.token}}).then(res => res.json());
    
    counts = {
        'Paper': 0,
        'Plastic': 0,
        'Metal': 0,
        'Glass': 0,
        'Organic': 0
    };

    for(let i =0; i < response.length; i++){
        counts.Paper += response[i].paper;
        counts.Plastic += response[i].plastic;
        counts.Metal += response[i].metal;
        counts.Glass += response[i].glass;
        counts.Organic += response[i].organic;
    }
    let chart = {
        type: 'pie',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: [
                    '#ffc234',
                    '#ff4069',
                    '#059bff',
                    '#808bfa',
                    '#fe8a47'
                ]
            }]
        }
    }
    console.log(counts);
    res.json(chart).end();
});

controller.route("GET", "/api/statistics/ticket" , async (req, res) => {
    let ticket = await fetch(`http://localhost:8081/api/tickets/ticket?ticketid=${req.query.ticketid}`, { headers: {'Cookie' : 'token=' + req.cookies.token} }).then(res => res.json());
    let location = await fetch(`http://localhost:8081/api/locations/location?locationid=${ticket.locationid}`, { headers: {'Cookie' : 'token=' + req.cookies.token} }).then(res => res.json());

    let chart = {
        type: 'bar',
        data: {
            labels: ['Paper', 'Plastic', 'Metal', 'Glass', 'Oraganic'],
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

controller.route("GET", "/api/statistics/location", async (req, res) => {   
    let tickets = await fetch(`http://localhost:8081/api/tickets/tickets?locationid=${req.query.locationid}`, { headers: {'Cookie' : 'token=' + req.cookies.token} }).then(res => res.json());
    let loc = await fetch(`http://localhost:8081/api/locations/location?locationid=${req.query.locationid}`, { headers: {'Cookie' : 'token=' + req.cookies.token} }).then(res => res.json());
    
    location = {
        paper: 0,
        plastic: 0,
        metal: 0,
        glass: 0,
        organic: 0
    }

    for(let i = 0; i < tickets.length; i++){
        location.paper += tickets[i].paper;
        location.plastic += tickets[i].plastic;
        location.metal += tickets[i].metal;
        location.glass += tickets[i].glass;
        location.organic += tickets[i].organic;
    }

    let chart = {
        type: 'bar',
        data: {
            labels: ['Paper', 'Plastic', 'Metal', 'Glass', 'Oraganic'],
            datasets: [{
                label: loc.str,
                data: Object.values(location),
                backgroundColor: '#e46436',
                borderColor: '#ff893c'
            }]
        },
        options: {}
    }
    
    res.json(chart).end();
})

module.exports = controller;