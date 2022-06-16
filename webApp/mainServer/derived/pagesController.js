const Controller = require('../base/baseController.js');
const Mime = require('../base/httpTypes.js')
const fs = require('fs')
const path = require('path');
const { StatusCodes } = require('http-status-codes');
const pageUtils = require('../base/pageUtils.js');
var controller = new Controller();

return404 = (res) => {
    res.statusCode = 404;
    res.write("Not found");
    res.end();
}

controller.route("GET", "/", (req, res) => {
    console.log(req.currentUser);
    if (req.currentUser)
        if(req.currentUser.isAdmin == 'true')
            return res.redirect('/adminDashboard').end();
        else
            return res.redirect('/citizenDashboard').end();
    lazyLoadPage(res, path.join(pageUtils('.html'), 'landing.html'), ['<registerComponent></registerComponent>', '<loginComponent></loginComponent>', '<switchComponent></switchComponent>'], ['registerComponent.html', 'loginComponent.html', 'switchComponent.html'])
});

controller.route("GET", "/documentation", (req, res) => {
    lazyLoadPage(res, path.join(pageUtils('.html'), 'documentation.html'), [], [])
});

controller.route("GET", "/citizenDashboard", (req, res) => {

});

controller.route("GET", "*", (req, res) => {
    let ext = path.parse(req.url).ext.toLowerCase();
    if(ext === '.html') {
        res.redirect(path.parse(req.url).name).end();
        return;
    }
    if(!pageUtils(ext)) {
        return404(res);
        return;
    }
    fs.stat(path.join(pageUtils(ext), req.url), (err, stat) => {
        if(!err) {
            res.setHeader('content-type', Mime(ext));
            fs.createReadStream(path.join(pageUtils(ext), req.url)).pipe(res);
        }
        else {
            return404(res);
        }
    });
});

lazyLoadPage = async (res, pagePath, oldContent, replaceWith) => {
    try{
        let pageContentPromise = fs.promises.readFile(pagePath)
        let [pageContent] = await Promise.all([pageContentPromise])
        
        let content = pageContent.toString()
        
        for(let i = 0; i < replaceWith.length; ++i) {
            let replaceWithPath = path.join(__dirname, '../pages/components', replaceWith[i]);

            let replaceContentPromise = fs.promises.readFile(replaceWithPath);
            let [newContent] = await Promise.all([replaceContentPromise]);

            content = content.toString().replace(oldContent[i], newContent);
        }

        res.setHeader('content-type', Mime('.html'));
        res.writeHead(200, { 'Content-Type': Mime('.html') });
        res.end(content, 'utf-8');

    }catch(err){
        console.log(err)
        if(err.code == 'ENOENT') {
            return404()
        }
        else {
            res.writeHead(500);
            res.end('Internal server error: ' + err.code + '\n');
        }
    }
}

module.exports = controller;