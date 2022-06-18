const path = require('path');

function routeMatches(root, route, method, url)
{
    if (route.method.toLowerCase() !== method.toLowerCase())
        return false;

    if (url.includes('?'))
        url = url.split('?')[0];
    
    var wildcard = false;
    var urlToMatch = route.url;
    if (route.url.endsWith('*'))
    {
        wildcard = true;
        urlToMatch = route.url.slice(0,-1);
    }
    if (wildcard)
        return url.startsWith(path.join(root, urlToMatch).replace(/\\/g, "/"));
    return url === (path.join(root, urlToMatch).replace(/\\/g, "/"));
}

class Controller {
    root = "/";
    routes = [];

    match = (req) => {
        for(let i = 0; i < this.routes.length; ++i) {
            let r = this.routes[i];
            if (routeMatches(this.root, r, req.method, req.url))
                return true;
        }
        return false;
    }

    route = (method, url, handle) => {
        this.routes.push({
            method, url, handle
        });
    }

    handle = (req, res) => {
        for(let i = 0; i < this.routes.length; ++i) {
            let r = this.routes[i];
            if (routeMatches(this.root, r, req.method, req.url)) {
                r.handle(req, res);
                break;
            }
        }
    }
}

module.exports = Controller;