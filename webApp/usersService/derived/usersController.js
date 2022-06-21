const Controller = require('../base/baseController.js');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const schemas = require('../schemas')
const bcrypt = require('bcrypt');
const db = require('./db.js');

var controller = new Controller();

controller.route("POST", "/register", (req, res) => {
    const {error, value} = schemas.userSchema.validateUser(req.body);
    if (error)
        return res.status(StatusCodes.BAD_REQUEST).end(error.toString());
    value.password = bcrypt.hashSync(value.password, 8);
    db.createUser(
        value,
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.toString());
            }
            else {
                const token = jwt.sign({username: value.username, isAdmin: value.isAdmin}, 'secret', {expiresIn: 24*60*60});
                res.json({token: token}).end();
            }
        }
    );
});

controller.route("POST", "/login", (req, res) => {
    const {error, value} = schemas.userSchema.validateUser(req.body);
    if (error)
        return res.status(StatusCodes.BAD_REQUEST).end(error.toString());
    console.log(error);
    db.findUser(
        value.username,
        (err, results) => {
            if (err)
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.toString());
            else
            {
                results = results.rows[0];
                console.log(results);
                bcrypt.compare(value.password, results.password, (err, result) => {
                    if (err)
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.toString());
                    else if (result)
                    {
                        const token = jwt.sign({username: results.username, isAdmin: results.isadmin}, 'secret', {expiresIn: 24*60*60});
                        res.json({token: token}).end();
                    }
                    else
                    {
                        res.status(StatusCodes.FORBIDDEN).end();
                    }
                });
            }
        }
    )
});

controller.route("DELETE", "/logout", (req, res) => {
    res.end();
});

module.exports = controller;