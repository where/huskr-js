var http = require('http');
var fs = require('fs');
var path = require('path');

var folder = process.argv[2] || 'app';
var port = process.argv[3] || 3000;

http.createServer(function (request, response) {
     
	var filePath = './' + folder + request.url;
	if (request.url == '/')
	    filePath = filePath + 'index.html';
	fs.exists(filePath, function(exists) {
		if (!exists) {
		    filePath = './' + folder + '/index.html';
		}
	    });
	
	console.log('serving: ' + filePath);

	var extname = path.extname(filePath);
	var contentType = 'text/html';
	switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
	}
     
	fs.exists(filePath, function(exists) {
		if (exists) {
		    fs.readFile(filePath, function(error, content) {
			    if (error) {
				response.writeHead(500);
				response.end();
			    }
			    else {
				response.writeHead(200, { 'Content-Type': contentType });
				response.end(content, 'utf-8');
			    }
			});
		}
		else {
		    response.writeHead(404);
		    response.end();
		}
	    });
     
    }).listen(port);
 
console.log('Serving '+ folder  +' at http://127.0.0.1:' + port);