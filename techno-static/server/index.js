const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const rooom={
    red:"id",
    blue:"id",
    turn:0,
    limit:1,
}
const socketIds = {};
const rooms = {};

io.on('connection', (socket) => {
	console.log('We have a new connection on '+socket.id);

	socket.on("join", (data) => {
        if (rooms[data] === undefined || rooms[data].limit < 2) {
            if (rooms[data] === undefined) {
                rooms[data] = {};
                rooms[data].red = socket.id;
                rooms[data].limit = 1;
                console.log(rooms[data]);
                socket.emit("roomid", { roomid: data, isPlayerBlue: false});
                console.log("yay");
            } else {
                if (rooms[data].red === undefined) {
                    rooms[data].red = socket.id;
                    rooms[data].limit += 1;
                    socket.emit("roomid", { roomid: data, isPlayerBlue: false});
                    console.log("y0");
                } else {
                    rooms[data].blue = socket.id;
                    rooms[data].limit += 1;
                    socket.emit("roomid", { roomid: data,isPlayerBlue: true});
                    console.log("hmm");
                }
            }
            socketIds[socket.id] = data;
            socket.join(data);
        }
    });

	socket.on("disconnect",() => {
		console.log("User has left!!");
    });
    
    socket.on('roomid',({roomid,isRed}) =>{
        this.isRed = isRed;
    });
});

app.use(router);

server.listen(PORT,() => console.log('Server has started on port',PORT));