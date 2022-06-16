const services = [
  {
    url: "http://localhost:8082",
    calls: [
      {
        method: "POST",
        path: "/register",
      },
      {
        method: "POST",
        path: "/login",
      },
    ],
  },
];

const fetch = require("node-fetch");
const Controller = require("../base/baseController.js");

var controller = new Controller();

function remakePath(req) {
  let url = req.url;
  let entries = Object.entries(req.query);
  if (entries.length > 0)
    url += "?" + entries.map((entry) => entry.join("=")).join("&");
  return url;
}

//Dynamically make routes
for (let service of services) {
  for (let call of service.calls) {
    if (call.path == "/register" || call.path == "/login") {
      controller.route(call.method, call.path, async (req, res) => {
        const url = service.url + remakePath(req);
        let fetchRequest = {
          method: call.method,
          headers: req.headers,
        };
        if (req.body) fetchRequest.body = JSON.stringify(req.body);

        const response = await fetch(url, fetchRequest);
        const responseBody = await response.text();
        if (response.ok) {
          console.log(responseBody);
          res.setHeader(
            "Set-Cookie",
            "token=" +
              JSON.parse(responseBody).token +
              `; HttpOnly;Secure;expires=Wed, 1 Nov 2023 00:00:00 GMT;Max-Age=9000000;Domain=localhost;Path=/;overwrite=true`
          );
          res.end();
        } else {
          res.status(response.status).end(responseBody);
        }
      });
    }
  }
}

module.exports = controller;
