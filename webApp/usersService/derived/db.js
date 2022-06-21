const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'GaMON',
    password: 'password',
    port: 5432,
})

exports.createUser = async (user, callback) =>{
    console.log(user.isAdmin);
    pool.query('insert into users(username, password, isadmin) values ($1, $2, $3)', [user.username, user.password, user.isAdmin], (err, results) => {
        console.log(err);
        console.log(results);
        if (err)
            return callback(err);
        callback(null, results);
    });
};

exports.findUser = async (username, callback) => {
    pool.query('select * from users where username=$1', [username], (err, results) => {
        console.log(err);
        console.log(results);
        if (err)
            return callback(err);
        if (results.rows.length == 0)
            return callback(new Error('No results found'));
        callback(null, results);
    });
}