const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io'); // importazione oggetto Server da socket.io
const conf = JSON.parse(fs.readFileSync("./conf.json"));

let list = []

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
    list.push(socket.nome)
    console.log(list)
    io.emit("render_user",list)
 });
socket.on('message', (message) => {
      const response = socket.nome + ': ' + message;
      console.log(response);
      io.emit("chat", response);
   });
socket.on('disconnect', () => {
    io.emit("chat", "disconected: " + socket.nome);
    list = list.filter(element => element !== socket.nome);
    io.emit("render_user",list)
});
});


server.listen(conf.port, () => {
  console.log("server running on port: " + conf.port);
});