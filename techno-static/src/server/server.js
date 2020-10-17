const server = require("http").createServer();
const io = require("socket.io")(server);

var rooms = {
  111: {
    state: null,
    users: 0,
  },
};

const PORT = 3001;

// Search for available rooms
function getRoomId() {
  var roomId;
  for (let i = 1; ; i++) {
    if (!rooms.hasOwnProperty(i)) {
      roomId = i;
      break;
    }
  }
  return roomId;
}

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("create room", (state) => {
    let roomNo = getRoomId();
    console.log("room " + roomNo + " created");
    socket.join(roomNo);
    socket.emit("room created", roomNo);

    // Assign randomly if user will be black or white
    let user = Math.floor(Math.random() * 2) + 1;
    // console.log('colour assigned: '+user);
    rooms[roomNo] = {
      state,
      user1: user === 1 ? true : false,
      user2: user === 2 ? true : false,
    };
    socket.emit("user", user, rooms[roomNo].state);
    // console.log(rooms[roomNo].state);
  });

  socket.on("send roomId", (roomId) => {
    if (roomId in rooms) {
      console.log("room " + roomId + " present");
      socket.join(roomId);
      if (rooms[roomId].user1 && rooms[roomId].user2) {
        // If both users are already connected, disconnect the socket
        console.log("room " + roomId + " full"); //***MAKE USER FRIENDLY */
        socket.disconnect(true);
      } else {
        let user = rooms[roomId].user1 ? 2 : 1;
        rooms[roomId] = {
          ...rooms[roomId],
          user1: true,
          user2: true,
        };
        socket.emit("user", user, rooms[roomId].state);
        io.to(roomId).emit("second joined");
        // console.log(Object.keys(rooms));
        // console.log(rooms[roomId].state);
      }
    } else {
      // When a room with this ID is not created
      console.log("Room doesnt exit");
      socket.disconnect(true);
    }
  });

  socket.on("player ready", () => {
    const room = Object.keys(socket.rooms);
    console.log("Player Ready");
    // io.to(roomId).emit("second joined");
    socket.broadcast.to(room[0]).emit("player ready");
  });

  // When some move is made
  socket.on("move made", (state) => {
    // Send all players belonging to same room the new state of the game
    const room = Object.keys(socket.rooms);
    console.log("Move made in room " + room[0]);
    io.to(room[0]).emit("board changed", state);
  });

  socket.on("end game", (loser) => {
    const room = Object.keys(socket.rooms);
    console.log("PLayer Submission", loser);
    io.to(room[0]).emit("surrender", loser);
  });

  socket.on("disconnecting", () => {
    // When socket is disconnecting, check which room it belongs to
    const room = Object.keys(socket.rooms);
    // Get all the sockets belonging to that room
    const socketIDs = Object.keys(io.sockets.adapter.rooms[room[0]].sockets);

    if (socketIDs.length === 1) {
      // If only one socket belongs to the room, delete the room
      console.log("room " + room[0] + " deleted");
      delete rooms[room[0]];
      console.log(Object.keys(rooms));
    } else {
      // If 2 sockets belong to that room, tell the other socket that opponent has quit
      console.log("user leaving");
      io.to(socketIDs[0] === socket.id ? socketIDs[1] : socketIDs[0]).emit(
        "opponent quit"
      );
    }
  });

  socket.on("disconnect", (msg) => {
    // console.log(msg);
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("listening on :" + PORT);
});
