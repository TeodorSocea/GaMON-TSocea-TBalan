const Controller = require('../base/baseController.js');
const Mime = require('../base/httpTypes.js')
const path = require('path');
const { StatusCodes } = require('http-status-codes');
var controller = new Controller();

controller.route("GET", "/", (req, res) => {
    console.log(req.currentUser);
    if (req.currentUser)
        return 
    returnResponse(res)
});

returnResponse = (res) =>{
    content = "Hello!"


    res.setHeader('content-type', Mime('.html'));
    res.writeHead(200, { 'Content-Type': Mime('.html') });
    res.end(content, 'utf-8');
}

module.exports = controller;