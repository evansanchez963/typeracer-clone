const getActiveRooms = require("../utils/getActiveRooms");

const joinRoomHandler = (socket, connectedClients, rooms) => {
  socket.on("join_room", (data) => {
    // Make sure room that user is connecting to does not have more than two clients.
    const activeRooms = getActiveRooms(rooms);

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

      /*
      // The first socket that joins the room fetches the text from the Metaphorsum API on the client.
      // The rest of the sockets recieve the same text.
      if (Object.keys(activeRooms).length === 1)
        socket.emit("fetch_text_data", { fetchData: true });
      else socket.emit("fetch_text_data", { fetchData: false });
      */

      console.log(
        `User ${data.user} with ID ${socket.id} connected to room ${data.room}.`
      );
    }
  });
};

module.exports = joinRoomHandler;
