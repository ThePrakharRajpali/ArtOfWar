const express  = require('express');
const socketio = require('socket.io');
const http     = require('http');
const cors     = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


mongoose.connect("mongodb+srv://Shridam:Techno20@cluster0.zrjf3.mongodb.net/Innovate?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Database connected"))
.catch((err) => {
    console.error("DB Connection Error: ${err.message}");
});

const Match = require("./match");
// const { match } = require('assert');


const maxTime = 20*60;


const initState = {
    squares: makearray(),
    pieces: makepieces(),
    blueScore: 0,
    redScore: 0,
    isGameOn: true,
    blueTurn: false,
    isSetup: true,
    numBlue: 0,
    numRed: 0,
    initialRedPiece: [6, 1, 1, 7, 5, 5, 4, 4, 3, 2, 1, 1],
    initialBluePiece: [6, 1, 1, 7, 5, 5, 4, 4, 3, 2, 1, 1],
};

const room = {
    red:"id",
    blue:"id",
    roomState: initState,
    limit:1,
}

const socketIds = {};
const rooms = {};
const timeintervals = {};
const intervals = {};


app.use(cors({ origin: "http://localhost:3000" }));

io.on('connection', (socket) => {
	console.log('We have a new connection on '+ socket.id);

    socket.on("moved", (data) => {
        rooms[socketIds[socket.id]].roomState.squares = data.squares;
        rooms[socketIds[socket.id]].roomState.pieces = data.pieces;
        rooms[socketIds[socket.id]].roomState.blueScore = data.blueScore;
        rooms[socketIds[socket.id]].roomState.redScore = data.redScore;
        rooms[socketIds[socket.id]].roomState.isGameOn = data.isGameOn;
        rooms[socketIds[socket.id]].roomState.blueTurn = data.turn;
        Match.findOne({ room: data.room}).then((match) => {
            match.redTime = timeintervals[socketIds[socket.id]].red;
            match.blueTime = timeintervals[socketIds[socket.id]].blue;
            match.redPoint = rooms[socketIds[socket.id]].roomState.redScore;
            match.bluePoint = rooms[socketIds[socket.id]].roomState.blueScore;
            match.save();
        }).catch(err => console.log(err))
        io.to(socketIds[socket.id]).emit("move", rooms[socketIds[socket.id]].roomState);
    });

	socket.on("join", (dict) => {
        var data = dict.data;
        var rollno = dict.rollno;
        console.log(dict.data);

        if (rooms[data] === undefined || rooms[data].limit < 2) {
            socketIds[socket.id] = data;
            socket.join(data);

            if (rooms[data] === undefined) {
                rooms[data] = {};
                rooms[data].red = socket.id;
                rooms[data].limit = 1;
                rooms[data].roomState = {
                    squares: makearray(),
                    pieces: makepieces(),
                    blueScore: 0,
                    redScore: 0,
                    isGameOn: true,
                    blueTurn: false,
                    isSetup: true,
                    numBlue: 0,
                    numRed: 0,
                    initialRedPiece: [6, 1, 1, 7, 5, 5, 4, 4, 3, 2, 1, 1],
                    initialBluePiece: [6, 1, 1, 7, 5, 5, 4, 4, 3, 2, 1, 1],
                };
                timeintervals[data] = {}
                timeintervals[data].red = maxTime;
                timeintervals[data].blue = maxTime;
                socket.emit("roomid", { roomid: data, isPlayerBlue: false, roomState: rooms[data].roomState});
                console.log("room created at " + data);

                Match.findOne({ room: data })
                    .exec()
                    .then((match) => {
                        if(match !== null) {
                            return;
                        }
                        
                        const match2 = new Match({
                            _id: new mongoose.Types.ObjectId(),
                            userRed: rollno,
                            room: data,
                        })

                        match2.save();
                    })
                    .catch(err => {
                        console.log(err);
                    })
                
            } else {
                if (rooms[data].red === undefined) {
                    Match.findOne({ room: data }).then((match) => {
                        if(match.winner !== undefined) return;

                        if(match.userRed === rollno){
                            rooms[data].red = socket.id;
                            rooms[data].limit += 1;
                            if(rooms[data].redTime === undefined){
                                rooms[data].redTime = maxTime;
                            }
                            socket.emit("roomid", { roomid: data, isPlayerBlue: false, roomState: rooms[data].roomState});
                            console.log("red boi in");
                        } else if(match.userBlue === rollno) {
                            rooms[data].blue = socket.id;
                            rooms[data].limit += 1;
                            socket.emit("roomid", { roomid: data,isPlayerBlue: true, roomState: rooms[data].roomState});
                        }
                    })
                    .catch(err => console.log(err))   
                } else if(rooms[data].blue === undefined){
                    Match.findOne({room: data}).then((match) => {
                        rooms[data].blue = socket.id;
                        rooms[data].limit += 1;
                        socket.emit("roomid", { roomid: data,isPlayerBlue: true, roomState: rooms[data].roomState});
                        console.log("blue boi in");
                        match.userBlue = rollno;
                        match.save()
                    })
                    .catch(err => console.log(err))
                    
                }
            }
            
        }
    });

	socket.on("disconnect", () => {
        if(rooms[socketIds[socket.id]]){
        if(rooms[socketIds[socket.id]].red ===socket.id){
            console.log("red boi left");
            rooms[socketIds[socket.id]].red= undefined;
            rooms[socketIds[socket.id]].limit--;
        } else if(rooms[socketIds[socket.id]].blue ===socket.id){
            console.log("blue boi left");
            rooms[socketIds[socket.id]].blue= undefined;
            rooms[socketIds[socket.id]].limit--;
        }}
        console.log(`${socket.id} disconnected`);
    });

    socket.on("newPieceAdd", (data) =>{
        rooms[socketIds[socket.id]].roomState.squares = data.squares;
        rooms[socketIds[socket.id]].roomState.pieces = data.pieces;
        rooms[socketIds[socket.id]].roomState.initialBluePiece = data.initialBluePiece;
        rooms[socketIds[socket.id]].roomState.initialRedPiece = data.initialRedPiece;
        rooms[socketIds[socket.id]].roomState.numRed = data.numRed;
        rooms[socketIds[socket.id]].roomState.numBlue = data.numBlue;

        io.to(socketIds[socket.id]).emit("newPieceAddedInfo", rooms[socketIds[socket.id]].roomState);
    });

    socket.on("win", (data) => {
        io.to(socketIds[socket.id]).emit("Ended", data);
        if(data===0 && rooms[socketIds[socket.id]].roomState.redScore < 180)  rooms[socketIds[socket.id]].roomState.redScore += 180;
        if(data===1 && rooms[socketIds[socket.id]].roomState.blueScore < 180)  rooms[socketIds[socket.id]].roomState.blueScore += 180;

        Match.findOne({room: socketIds[socket.id]})
            .exec()
            .then((match) => {
                match.winner = data;
                match.redTime = timeintervals[socketIds[socket.id]].red;
                match.blueTime = timeintervals[socketIds[socket.id]].blue;
                match.redPoint = rooms[socketIds[socket.id]].roomState.redScore;
                match.bluePoint = rooms[socketIds[socket.id]].roomState.blueScore;
                match.save();
            })
            .catch((err) => {
                console.error(err);
            })
        rooms[socketIds[socket.id]].roomState.isGameOn = false;
        clearInterval(intervals[socketIds[socket.id]]);

        

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
                        rooms[socketIds[socket.id]].roomState.isGameOn = false;
                        rooms[socketIds[socket.id]].roomState.redScore += 180;
                        Match.findOne({room: socketIds[socket.id]})
                            .exec()
                            .then((match) => {
                                match.winner = 0;
                                match.redTime = timeintervals[socketIds[socket.id]].red;
                                match.blueTime = timeintervals[socketIds[socket.id]].blue;
                                match.redPoint = rooms[socketIds[socket.id]].roomState.redScore;
                                match.bluePoint = rooms[socketIds[socket.id]].roomState.blueScore;
                                match.save();
                            })
                            .catch((err) => {
                                console.error(err);
                            })
                        clearInterval(intervals[socketIds[socket.id]]);
                    }
                } else {
                    --timeintervals[socketIds[socket.id]].red;
                    if (timeintervals[socketIds[socket.id]].red < 1) {
                        io.to(socketIds[socket.id]).emit("Ended", 1);
                        rooms[socketIds[socket.id]].roomState.isGameOn = false;
                        rooms[socketIds[socket.id]].roomState.blueScore += 180;
                        Match.findOne({room: socketIds[socket.id]})
                            .exec()
                            .then((match) => {
                                match.winner = 1;
                                match.redTime = timeintervals[socketIds[socket.id]].red;
                                match.blueTime = timeintervals[socketIds[socket.id]].blue;
                                match.redPoint = rooms[socketIds[socket.id]].roomState.redScore;
                                match.bluePoint = rooms[socketIds[socket.id]].roomState.blueScore;
                                match.save();
                            })
                            .catch((err) => {
                                console.error(err);
                            })
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

function makearray() {
    let board = [];

    for(var i = 0; i<12; i++) {

        for(var j =0; j<10;j++) {
            let square = {
                isLake: isLake(i,j),
                pieceid: {
                    isBlue: null, //set this as 0 or 1, not true or false.
                    index: null,
                },
                isHighlighted: false,
                isPurple: false,
                hasPiece: false,
            };

            board.push(square);
        }
    }
    return board;
}

function makepieces() { //pieces[0][index] are red, pieces[1][index] are blue.
    let pieces = [];

    let redPieces = makePieceArray(false);
    let bluePieces = makePieceArray(true);
    
    pieces.push(redPieces);
    pieces.push(bluePieces);

    return pieces;
}

function makePieceArray(isBlue) {
    let part = [];

    for(let i = 0;i<6;i++)
        part.push(pieceMaker(isBlue,-1,false));

    part.push(pieceMaker(isBlue,0,false));
    part.push(pieceMaker(isBlue,1,true));

    for(let i=0;i<7;i++)
        part.push(pieceMaker(isBlue,2,true));

    for(let i=0;i<5;i++)
        part.push(pieceMaker(isBlue,3,true));

    for(let i=0;i<5;i++)
        part.push(pieceMaker(isBlue,4,true));

    for(let i=0;i<4;i++)
        part.push(pieceMaker(isBlue,5,true));

    for(let i=0;i<4;i++)
        part.push(pieceMaker(isBlue,6,true));

    for(let i=0;i<3;i++)
        part.push(pieceMaker(isBlue,7,true));

    for(let i=0;i<2;i++)
        part.push(pieceMaker(isBlue,8,true));

    part.push(pieceMaker(isBlue,9,true));
    part.push(pieceMaker(isBlue,10,true));

    return part;
}

function isLake(i,j) {
    if(i>=4 && i<=5 && j>=2 && j<=3)
        return true;
    if(i===6 && j===3)
        return true;
    if(i===5 && j===6)
        return true;
    if(i>=6 && i<=7 && j>=6 && j<=7)
        return true;

    return false;
}

function pieceMaker(isBlue, rank, isMovable) {
    let piece = {
        isBlue: isBlue,
        pos: null,
        rank: rank,
        isMovable: isMovable,
        isAlive: true,
    };

    return piece;
}
