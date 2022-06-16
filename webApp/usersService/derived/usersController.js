const Controller = require('../base/baseController.js');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const schemas = require('../schemas')
const bcrypt = require('bcrypt');

var controller = new Controller();

controller.route("POST", "/register", (req, res) => {
    const {error, value} = schemas.userSchema.validateUser(req.body);
    if (error)
        return res.status(StatusCodes.BAD_REQUEST).end(error.toString());
    console.log(value)
    value.password = bcrypt.hashSync(value.password, 8);
    const token = jwt.sign({username: value.username, isAdmin: value.is_admin}, 'secret', {expiresIn: 24*60*60});
    res.json({token: token}).end();
});

controller.route("POST", "/login", (req, res) => {
    const {error, value} = schemas.userSchema.validateUser(req.body);
    if (error)
        return res.status(StatusCodes.BAD_REQUEST).end(error.toString());
    const token = jwt.sign({username: value.username, isAdmin: value.is_admin}, 'secret', {expiresIn: 24*60*60});
    res.json({token: token}).end();
});

module.exports = controller;