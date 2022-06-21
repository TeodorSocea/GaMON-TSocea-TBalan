const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'GaMON',
    password: 'password',
    port: 5432,
})

exports.getLocationById = (locationid, callback) => {
    pool.query('select str, lat, long, active, tags from locations where id=$1', [locationid], (err, results) => {
        if(err){
            console.log( err);
            return callback(err);
        }
        callback(null, results);
    })
}

exports.getAllLocations = (callback) => {
    pool.query('select str, lat, long, active, tags from locations',
    (err, results) => {
        callback(null, results);
    }
    );
}

exports.addLocation = (location, callback) => {
    pool.query('insert into locations(str, lat, long, tags) values ($1, $2, $3, $4)',
    [location.str, location.lat, location.long, location.tags],
    (err, results) => {
        console.log(err);
        console.log(results);
        if (err)
            return callback(err);
        callback(null, results);
    }
    )
}