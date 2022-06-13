const Controller = require('../base/baseController.js');
const Mime = require('../base/httpTypes.js')
const fs = require('fs')
const path = require('path');
const { StatusCodes } = require('http-status-codes');
var controller = new Controller();

controller.route("GET", "/", (req, res) => {
    console.log(req.currentUser);
    if (req.currentUser)
        return 
    lazyLoadPage(res, './mainServer/pages/dummy.txt')
});

controller.route("GET", "/documentation", (req, res) => {
    lazyLoadPage(res, './mainServer/pages/documentation.html')
});

lazyLoadPage = async (res, pagePath) => {
    try{
        let pageContentPromise = fs.promises.readFile(pagePath)
        let [pageContent] = await Promise.all([pageContentPromise])
        
        let content = pageContent.toString()

        res.setHeader('content-type', Mime('.html'));
        res.writeHead(200, { 'Content-Type': Mime('.html') });
        res.end(content, 'utf-8');

    }catch(err){
        console.log(err)
        if(err.code == 'ENOENT') {
            res.statusCode = 404;
            res.write("Not found");
            res.end();
        }
        else {
            res.writeHead(500);
            res.end('Internal server error: ' + err.code + '\n');
        }
    }
}

module.exports = controller;