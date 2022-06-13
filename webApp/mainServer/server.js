const http = require('http');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const controllers = [];

function setCorsOrigin(res) {
    res.setHeader('Access-Control-Allow-Origin', 'localhost');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Max-Age', 3600);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
}

function shouldSkipAuthorization(req)
{
    const publicAvailablePaths = {
        POST: [
        ], 
        GET: [
            '/'
        ]
    }
    if (!publicAvailablePaths[req.method])
        return false;
    for (let path of publicAvailablePaths[req.method])
    {
        if (path.endsWith('*'))
        {
            if (req.url.startsWith(path.slice(0,-1)))
                return true;
        }
        else
            if (req.url === path)
                return true;
    }
    return false;
}

const addRequestFunctionality = (req) => {
    req.cookies = {};
    if (req.headers && req.headers.cookie)
    {
        const cookies = req.headers.cookie.split(';');
        cookies.forEach(pair => {
            [key, value] = pair.split('=', 2);
            key = key.trim();
            value = value.trim();
            req.cookies[key] = value;
        });
    }

    req.authorize = function(callback) {
        console.log(this.method, this.url);
        const token = this.cookies.token;
        if (!token || token === '')
        {
            if (shouldSkipAuthorization(this))
                return callback(null, null);
            return callback(new Error('No token provided'));
        }
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err)
            {
                if (shouldSkipAuthorization(this))
                    return callback(null, null);
                return callback(err);
            }
            return callback(null, decoded);
        });
    };

    const parsedUrl = new URL('http://www.noURL.com' + req.url);

    req.url = parsedUrl.pathname;
    req.query = {};
    var queryParams = parsedUrl.searchParams.entries();
    for (var entry of queryParams)
        req.query[entry[0]] = entry[1];
    
    return req;
}

const addResponseFunctionality = (res) => {
    setCorsOrigin(res);
    res.status = function(code) {
        this.statusCode = code; 
        return this;
    };
    res.redirect = function(location) {
        res.writeHead(302, {
            'Location': location,
        });
        return this;
    }
    return res;
}

const server = http.createServer(function (req, res) {
    req = addRequestFunctionality(req);
    res = addResponseFunctionality(res);

    req.authorize((err, decoded) => {
        if (err) {
            console.error(err);
            res.redirect('/').end();
            return;
        }
        req.currentUser = decoded;
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        }).on('error', (err) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.toString());
        }).on('end', () => {
            try
            {
                if (req.method !== 'GET' && req.method !== 'DELETE' && body !== '') 
                    req.body = JSON.parse(body);
                else
                    req.body = null;

                for(let i = 0; i < controllers.length; ++i) {
                    let controller = controllers[i];
                    if(controller.match(req)) {
                        controller.handle(req, res);
                        break;
                    }
                }    
            }
            catch (err)
            {
                console.error(err.toString());
                res.status(StatusCodes.BAD_REQUEST).end(err.toString());
            }
        });
    });
});

server.listen(8081);
console.log('Server running at localhost:8081');