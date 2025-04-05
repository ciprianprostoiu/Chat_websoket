const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io'); // importazione oggetto Server da socket.io
const conf = JSON.parse(fs.readFileSync("./conf.json"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
socket.on('connessione', (message) => {
    console.log("socket connected: " + socket.id);
    io.emit("chat", "new client: " + message);
    socket.nome = message;
 });
socket.on('message', (message) => {
      const response = socket.nome + ': ' + message;
      console.log(response);
      io.emit("chat", response);
   });
});

server.listen(conf.port, () => {
  console.log("server running on port: " + conf.port);

});