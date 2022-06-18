const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'GaMON',
    password: 'password',
    port: 5432,
})

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res.rows)
    pool.end()
})