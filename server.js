//initialize express app and middleware
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});


//initialize http server
const http = require('http').Server(app);
const port = 3000;
http.listen(port, function() {
  console.log('listening on *:', port);
});
