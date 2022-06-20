const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'GaMON',
    password: 'password',
    port: 5432,
})

exports.createTicket = async (ticket, callback) =>{
    pool.query('insert into tickets(submitterid, locationid, paper, metal, glass, organic, comment) values ($1, $2, $3, $4, $5, $6, $7)', 
    [ticket.submitterID, ticket.locationID, ticket.paper, ticket.metal, ticket.glass, ticket.organic, ticket.comment], 
    (err, results) => {
        console.log(err);
        console.log(results);
        if (err)
            return callback(err);
        callback(null, results);
    });
};

exports.getIdFromUsername = async (username, callback) => {
    pool.query('select id from users where username=$1', [username], (err, results) => {
        console.log(err);
        console.log(results);
        if (err)
            return callback(err);
        if (results.rows.length == 0)
            return callback(new Error('No results found'));
        callback(null, results);
    });
}

exports.getTopTickets = async (top, callback) => {
    pool.query('select id, submitterid, locationid, datesubmitted, datesolved, paper, plastic, metal, glass, organic, comment, active from tickets where active=\'true\' ORDER BY datesubmitted DESC limit $1',
    [top], 
    (err, results) => {
        console.log(err);
        console.log(results);
        if (err)
            return callback(err);
        callback(null, results);
    });
}

exports.getAllTickets = async (callback) => {
    pool.query('select id, submitterid, locationid, datesubmitted, datesolved, paper, plastic, metal, glass, organic, comment, active from tickets where active=\'true\' ORDER BY datesubmitted DESC',
    (err, results) => {
        console.log(err);
        console.log(results);
        if (err)
            return callback(err);
        callback(null, results);   
    });
}

exports.getTicketById = async (ticketid, callback) => {
    pool.query('select id, submitterid, locationid, datesubmitted, datesolved, paper, plastic, metal, glass, organic, comment, active from tickets where id=$1',
    [ticketid],
    (err, results) => {
        if(err){
            console.log(err);
            return callback(err);
        }
        callback(null, results);
    });
}