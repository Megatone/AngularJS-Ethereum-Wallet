var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = 8080;
app.use(express.static('public'));
server.listen(port, function () {
    console.log("Iniciando Servidor Puerto : " + port);
});