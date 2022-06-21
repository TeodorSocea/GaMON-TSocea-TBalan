const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'GaMON',
    password: 'password',
    port: 5432,
})

exports.getTicketsSubmittedBeforeDate = (date, callback) => {
    pool.query('select  count(datesubmitted) from tickets where active=\'true\' and datesubmitted::timestamp::date <= $1',
    [date], 
    (err, results) => {
        console.log(err)
        if (err)
            return callback(err);
        callback(null, results, date);
    });
}

exports.getTicketsSolvedOnDate = (date, callback) => {
    pool.query('select count(datesolved) from tickets where active=\'true\' and datesolved::timestamp::date = $1',
    [date], 
    (err, results) => {
        console.log(err);
        console.log(date);
        if (err)
            return callback(err);
        callback(null, results, date);
    });
}