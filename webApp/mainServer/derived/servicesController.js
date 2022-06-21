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
        {
            method:"DELETE",
            path: "/logout"
        }
    ],
  },
  {
    url: "http://localhost:8083",
    calls: [
        {
            method: "GET",
            path: "/api/locations/closeLocations"
        },
        {
            method: "GET",
            path: "/location"
        },
        {
            method: "GET",
            path: "/api/locations/location"
        },
        {
            method: "GET",
            path: "/api/locations/allLocations"
        },
        {
            method: "POST",
            path: "/api/locations/addLocation"
        },
        {
            method: "PUT",
            path: "/api/locations/updateLocation"
        },
        {
            method: "GET",
            path: "/api/locations/export"
        }
    ]
  },
  {
    url: "http://localhost:8084",
    calls:[
        {
            method: "POST",
            path: "/ticketSubmit"
        },
        {
            method: "GET",
            path: "/topTickets"
        },
        {
            method: "GET",
            path: "/api/tickets/ticket"
        },
        {
           method: "PUT",
           path: "/api/tickets/updateTicket"
        },
        {
           method: "GET",
           path: "/api/tickets/activeTickets"
        },
        {
          method: "GET",
          path: "/api/tickets/solvedTickets"
        },
        {
          method: "GET",
          path: "/api/tickets/tickets"
        },
        {
          method: "GET",
          path: "/api/tickets/export"
        }
    ]
  },
  {
    url: "http://localhost:8085",
    calls: [
      {
        method: "GET",
        path: "/ticketsChart"
      },
      {
        method: "GET",
        path: "/trashChart"
      },
      {
        method: "GET",
        path: "/api/statistics/ticket"
      },
      {
        method: "GET",
        path: "/api/statistics/location"
      }
    ]
  }
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
    if (call.path === "/register" || call.path === "/login") {
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
              `; HttpOnly;Secure;expires=Wed, 01 Nov 2023 00:00:00 GMT;Max-Age=9000000;Domain=localhost;`
          );
          res.setHeader("Content-Type", "application/json;charset=\"utf-8\"");
          res.end();
        } else {
          res.status(response.status).end(responseBody);
        }
      });
    }else if(call.path === "/logout"){
        controller.route(call.method, call.path, async (req, res) => {
            const url = service.url + remakePath(req);
            let fetchRequest = {
                method: call.method,
                headers: req.headers
            };
            if (req.body)
                fetchRequest.body = JSON.stringify(req.body);

            const response = await fetch(url, fetchRequest);
            if (response.ok)
            {
                console.log('ok');
                res.setHeader('Set-Cookie', `token=deleted;Secure;HttpOnly;expires=Thu, 01 Jan 1970 00:00:00 GMT;Max-Age=9000000;Domain=localhost;Path=/`);
                res.setHeader("Content-Type", "application/json;charset=\"utf-8\"");
                res.end();
            }
            else
            {
                res.status(response.status).end(responseBody);
            }
        });
    }else{
        controller.route(call.method, call.path, async (req, res) => {
            const url = service.url + remakePath(req);
            let fetchRequest = {
                method: call.method,
                headers: req.headers
            };
            if (req.body)
                fetchRequest.body = JSON.stringify(req.body);
            const response = await fetch(url, fetchRequest);
            const responseBody = await response.text();
            let contentType = response.headers.get('Content-Type');
            console.log(contentType);
            if (contentType){
              res.setHeader('Content-Type', contentType + ";charset=\"utf-8\"");
              if(contentType === 'application/octet-stream');
                res.setHeader('Content-Disposition', response.headers.get('Content-Disposition'));
            }
            else
              res.setHeader('Content-Type', "text/plain;charset=\"utf-8\"");
            res.status(response.status).end(responseBody);
        });
    }
    }
}

module.exports = controller;
