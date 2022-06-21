const Controller = require("../base/baseController.js");
const Mime = require("../base/httpTypes.js");
const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const pageUtils = require("../base/pageUtils.js");
var controller = new Controller();

return404 = (res) => {
  res.statusCode = 404;
  res.write("Not found");
  res.end();
};

controller.route("GET", "/", (req, res) => {
  
  if (req.currentUser){
    console.log(req.currentUser.isAdmin)
    if (req.currentUser.isAdmin === 'true')
      return res.redirect("/adminDashboard").end();
    else return res.redirect("/citizenDashboard").end();
  }
  lazyLoadPage(
    res,
    path.join(pageUtils(".html"), "landing.html"),
    [
      "<registerComponent></registerComponent>",
      "<loginComponent></loginComponent>",
      "<switchComponent></switchComponent>",
    ],
    ["registerComponent.html", "loginComponent.html", "switchComponent.html"]
  );
});

controller.route("GET", "/documentation", (req, res) => {
  lazyLoadPage(
    res,
    path.join(pageUtils(".html"), "documentation.html"),
    [],
    []
  );
});

controller.route("GET", "/citizenDashboard", (req, res) => {
  lazyLoadPage(
    res,
    path.join(pageUtils(".html"), "citizenDashboard.html"),
    [
      "<ticketSubmitComponent></ticketSubmitComponent>",
      "<popupComponenet></popupComponenet>",
    ],
    ["ticketSubmitComponent.html", "popupComponent.html"]
  );
});

controller.route("GET", "/adminDashboard", (req, res) => {
  if(req.currentUser === undefined)
    return res.redirect("/").end();
  if(req.currentUser.isAdmin === 'false')
    return res.redirect("/").end();
  lazyLoadPage(
    res,
    path.join(pageUtils(".html"), "adminDashboard.html"),
    [],
    []
  );
});

controller.route("GET", "/ticket", (req, res) => {
  if(req.currentUser === undefined)
    return res.redirect("/").end();
  if(req.currentUser.isAdmin === 'false')
    return res.redirect("/").end();
  if(req.query.ticketid === undefined || req.query.ticketid === '')
    return res.redirect("/").end();
  dynamicGeneratePage(
    res,
    path.join(pageUtils(".html"), "ticket.html"),
    ["<body>"],
    [`<body onload=\"grabTicket(${req.query.ticketid})\">`]
  );
});

controller.route("GET", "/locationsList", (req, res) => {
  if(req.currentUser === undefined)
    return res.redirect("/").end();
  if(req.currentUser.isAdmin === 'false')
    return res.redirect("/").end();
  dynamicGeneratePage(
    res,
    path.join(pageUtils(".html"), "locations.html"),
    [],
    []
  );
})

controller.route("GET", "/locationsList/addLocation", (req, res) => {
  if(req.currentUser === undefined)
    return res.redirect("/").end();
  if(req.currentUser.isAdmin === 'false')
    return res.redirect("/").end();
  dynamicGeneratePage(
    res,
    path.join(pageUtils(".html"), "addLocation.html"),
    [],
    []
  );
});

controller.route("GET", "/locationsList/location", (req, res) => {
  if(req.currentUser === undefined)
    return res.redirect("/").end();
  if(req.currentUser.isAdmin === 'false')
    return res.redirect("/").end();
  dynamicGeneratePage(
      res,
      path.join(pageUtils(".html"), "location.html"),
      ["<body>"],
      [`<body onload=\"grabLocation(${req.query.locationid})\">`]
  );
});

controller.route("GET", "/ticketsList", (req, res) => {
  if(req.currentUser === undefined)
    return res.redirect("/").end();
  if(req.currentUser.isAdmin === 'false')
    return res.redirect("/").end();
  dynamicGeneratePage(
      res,
      path.join(pageUtils(".html"), "tickets.html"),
      [],
      []
  );
});

controller.route("GET", "*", (req, res) => {
  let ext = path.parse(req.url).ext.toLowerCase();
  if (ext === ".html") {
    res.redirect(path.parse(req.url).name).end();
    return;
  }
  if (!pageUtils(ext)) {
    return404(res);
    return;
  }
  fs.stat(path.join(pageUtils(ext), req.url), (err, stat) => {
    if (!err) {
      res.setHeader("content-type", Mime(ext));
      if(ext !== ".png")
        res.writeHead(200, { "Content-Type": Mime(ext) + "; charset=utf-8" });
      fs.createReadStream(path.join(pageUtils(ext), req.url)).pipe(res);
    } else {
      return404(res);
    }
  });
});

dynamicGeneratePage = async (res, pagePath, oldContent, replaceWith) =>{
  try {
    let pageContentPromise = fs.promises.readFile(pagePath);
    let [pageContent] = await Promise.all([pageContentPromise]);

    let content = pageContent.toString();

    for (let i = 0; i < replaceWith.length; ++i) {
      content = content.toString().replace(oldContent[i], replaceWith[i]);
    }

    res.setHeader("content-type", Mime(".html"));
    res.writeHead(200, { "Content-Type": Mime(".html") + "; charset=utf-8" });
    res.end(content, "utf-8");
  } catch (err) {
    console.log(err);
    if (err.code == "ENOENT") {
      return404();
    } else {
      res.writeHead(500);
      res.end("Internal server error: " + err.code + "\n");
    }
  }
}

lazyLoadPage = async (res, pagePath, oldContent, replaceWith) => {
  try {
    let pageContentPromise = fs.promises.readFile(pagePath);
    let [pageContent] = await Promise.all([pageContentPromise]);

    let content = pageContent.toString();

    for (let i = 0; i < replaceWith.length; ++i) {
      let replaceWithPath = path.join(
        __dirname,
        "../pages/components",
        replaceWith[i]
      );

      let replaceContentPromise = fs.promises.readFile(replaceWithPath);
      let [newContent] = await Promise.all([replaceContentPromise]);

      content = content.toString().replace(oldContent[i], newContent);
    }

    res.setHeader("content-type", Mime(".html"));
    res.writeHead(200, { "Content-Type": Mime(".html") + "; charset=utf-8" });
    res.end(content, "utf-8");
  } catch (err) {
    console.log(err);
    if (err.code == "ENOENT") {
      return404();
    } else {
      res.writeHead(500);
      res.end("Internal server error: " + err.code + "\n");
    }
  }
}

module.exports = controller;
