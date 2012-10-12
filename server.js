var express = require('express');
var app = express();

app.use(express.logger());
app.use(express.static(__dirname + '/app'));
app.get('*', function(req, res) {
  res.sendfile(__dirname + '/app/index.html');
});
var server = app.listen(5000);
console.log('Server running on port %s', server.address().port);