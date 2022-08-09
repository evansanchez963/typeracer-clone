const getActiveRooms = require("../utils/getActiveRooms");

const joinRoomHandler = (socket, connectedClients, rooms) => {
  socket.on("join_room", (data) => {
    // Make sure room that user is connecting to does not have more than two clients.
    let activeRooms = getActiveRooms(rooms);

    if (
      activeRooms.hasOwnProperty(data.room) &&
      activeRooms[data.room].size === 2
    ) {
      socket.emit("join_room_error", "This room is full.");

      console.log(`Room ${data.room} is full.`);
    } else {
      socket.join(data.room);
      connectedClients[socket.id] = data.user;
      socket.emit("join_room_success", { room: data.room });

      activeRooms = getActiveRooms(rooms);

      // If there are two clients in a room, start a game in that room.
      if (activeRooms[data.room].size === 2) {
        socket.emit("start_game", { start: true });
        socket.to(data.room).emit("start_game", { start: true });
      }

      console.log(
        `User ${data.user} with ID ${socket.id} connected to room ${data.room}.`
      );
    }
  });
};

module.exports = joinRoomHandler;
