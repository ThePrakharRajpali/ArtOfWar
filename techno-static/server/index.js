const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const initState = {
    squares: [],
    pieces: [],
    blueScore: 0,
    redScore: 0,
    isGameOn: true,
    blueTurn: false,
};

const room={
    red:"id",
    blue:"id",
    roomState: "initState",
    limit:1,
}

const socketIds = {};
const rooms = {};

io.on('connection', (socket) => {
	console.log('We have a new connection on '+socket.id);

    socket.on("moved", (data) => {
        rooms[socketIds[socket.id]].roomState.squares = data.squares;
        rooms[socketIds[socket.id]].roomState.pieces = data.pieces;
        rooms[socketIds[socket.id]].roomState.blueScore = data.blueScore;
        rooms[socketIds[socket.id]].roomState.redScore = data.redScore;
        rooms[socketIds[socket.id]].roomState.isGameOn = data.isGameOn;
        rooms[socketIds[socket.id]].roomState.blueTurn = data.turn;

        io.to(socketIds[socket.id]).emit("move", rooms[socketIds[socket.id]].roomState);
    });

	socket.on("join", (data) => {
        if (rooms[data] === undefined || rooms[data].limit < 2) {
            if (rooms[data] === undefined) {
                rooms[data] = {};
                rooms[data].red = socket.id;
                rooms[data].limit = 1;
                rooms[data].roomState = initState;
                console.log(rooms[data]);
                socket.emit("roomid", { roomid: data, isPlayerBlue: false});
                console.log("room created?");
            } else {
                if (rooms[data].red === undefined) {
                    rooms[data].red = socket.id;
                    rooms[data].limit += 1;
                    console.log(rooms[data]);
                    socket.emit("roomid", { roomid: data, isPlayerBlue: false});
                    console.log("red boi in");
                } else {
                    rooms[data].blue = socket.id;
                    rooms[data].limit += 1;
                    console.log(rooms[data]);
                    socket.emit("roomid", { roomid: data,isPlayerBlue: true});
                    console.log("blue boi in");
                }
            }
            socketIds[socket.id] = data;
            socket.join(data);
        }
    });

	socket.on("disconnect", () => {
        if(rooms[socketIds[socket.id]]){
        if(rooms[socketIds[socket.id]].red ===socket.id){
            console.log("red boi left");
            rooms[socketIds[socket.id]].red= undefined;
            rooms[socketIds[socket.id]].limit--;
            delete socketIds[socket.id];
        } else if(rooms[socketIds[socket.id]].blue ===socket.id){
            console.log("blue boi left");
            rooms[socketIds[socket.id]].blue= undefined;
            rooms[socketIds[socket.id]].limit--;
            delete socketIds[socket.id];
        }}
        console.log(`${socket.id} disconnected`);
    });
    
    socket.on('roomid',({roomid,isRed}) =>{
        this.isRed = isRed;
    });
});

app.use(router);

server.listen(PORT,() => console.log('Server has started on port',PORT));