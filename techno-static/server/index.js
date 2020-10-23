const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const maxTime = 20*60;

const initState = {
    squares: [],
    pieces: [],
    blueScore: 0,
    redScore: 0,
    isGameOn: true,
    blueTurn: false,
    isSetup: true,
};

const room={
    red:"id",
    blue:"id",
    roomState: "initState",
    limit:1,
}

const socketIds = {};
const rooms = {};
const timeintervals = {};
const intervals = {};

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
                rooms[data].blueReady = false;
                rooms[data].redReady = false;
                timeintervals[data]={}
                timeintervals[data].red=maxTime;
                timeintervals[data].blue=maxTime;
                socket.emit("roomid", { roomid: data, isPlayerBlue: false});
                console.log("room created?");
            } else {
                if (rooms[data].red === undefined) {
                    rooms[data].red = socket.id;
                    rooms[data].limit += 1;
                    socket.emit("roomid", { roomid: data, isPlayerBlue: false});
                    console.log("red boi in");
                } else {
                    rooms[data].blue = socket.id;
                    rooms[data].limit += 1;
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

    socket.on("newPieceAdd", (data) =>{
        rooms[socketIds[socket.id]].roomState.squares = data.squares;
        rooms[socketIds[socket.id]].roomState.pieces = data.pieces;

        io.to(socketIds[socket.id]).emit("newPieceAddedInfo", rooms[socketIds[socket.id]].roomState);
    });

    socket.on("win", (data) => {
        io.to(socketIds[socket.id]).emit("Ended", data);
        clearInterval(intervals[socketIds[socket.id]]);

        if(data===0 && rooms[socketIds[socket.id]].redScore < 180)  rooms[socketIds[socket.id]].redScore += 180;
        if(data===1 && rooms[socketIds[socket.id]].blueScore < 180)  rooms[socketIds[socket.id]].blueScore += 180;

    });

    socket.on("ready", () => {
        if(rooms[socketIds[socket.id]]===undefined) return;
        if (rooms[socketIds[socket.id]].ready === undefined) {
            rooms[socketIds[socket.id]].ready = 1;
        } else if (
            rooms[socketIds[socket.id]].ready === 1 &&
            rooms[socketIds[socket.id]].limit === 2
        ) {
            rooms[socketIds[socket.id]].ready = 2;
            rooms[socketIds[socket.id]].roomState.isSetup = false;
            io.to(socketIds[socket.id]).emit("setupDone",rooms[socketIds[socket.id]].roomState);
            intervals[socketIds[socket.id]] = setInterval(() => {
                if (rooms[socketIds[socket.id]].roomState.blueTurn === true) {
                    --timeintervals[socketIds[socket.id]].blue;
                    if (timeintervals[socketIds[socket.id]].blue < 1) {
                        io.to(socketIds[socket.id]).emit("Ended", 0);
                        rooms[socketIds[socket.id]].roomState.redScore += 180;
                        clearInterval(intervals[socketIds[socket.id]]);
                    }
                } else {
                    --timeintervals[socketIds[socket.id]].red;
                    if (timeintervals[socketIds[socket.id]].red < 1) {
                        io.to(socketIds[socket.id]).emit("Ended", 1);
                        rooms[socketIds[socket.id]].roomState.blueScore += 180;
                        clearInterval(intervals[socketIds[socket.id]]);
                    }
                }
                io.to(socketIds[socket.id]).emit(
                    "timer",
                    timeintervals[socketIds[socket.id]]
                );
            }, 1000);
        }
    });
});

app.use(router);

server.listen(PORT,() => console.log('Server has started on port',PORT));

//TODO
//Restrict opposite movement when not in turn (done)
//