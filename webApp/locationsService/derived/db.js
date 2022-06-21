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

exports.getAllLocations = async (callback) => {
    pool.query('select id, str, lat, long, active, tags from locations ORDER BY ID DESC',
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

exports.updateLocation = (locationid, value, callback) => {
    pool.query('update locations set active = $1 where id = $2',
    [value, locationid],
    (error, results) =>{
        callback(null, results);
    });
}