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