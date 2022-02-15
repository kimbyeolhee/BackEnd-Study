var http = require('http');
var fs = require('fs');
const { response } = require('express');

function onRequest(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    fs.readFile('index.html', 'utf-8', (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end();
        }
        res.write(data);
        console.log("server response!!!")
        res.end();
    })
}

http.createServer(onRequest).listen(8080);