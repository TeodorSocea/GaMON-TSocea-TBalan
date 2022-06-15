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
    // db.createUser(
    //     value,
    //     (err, result) => {
    //         if (err) {
    //             console.log(err);
    //             res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.toString());
    //         }
    //         else {
    //             const token = jwt.sign({username: value.username, isAdmin: value.is_admin}, 'secret', {expiresIn: 24*60*60});
    //             res.json({token: token}).end();
    //         }
    //     }
    // );
    const token = jwt.sign({username: value.username, isAdmin: value.is_admin}, 'secret', {expiresIn: 24*60*60});
    res.json({token: token}).end();
});

module.exports = controller;