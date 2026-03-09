import { Server} from "socket.io";
function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "https://web3-task-assignment-686y.vercel.app/" },
  });
  let rooms = {};

 io.on("connection", (socket) => {
  console.log("User connected:", socket.id);  
  socket.on("create_room", ({ lobbyId, username }) => {

  if (!rooms[lobbyId]) {
    rooms[lobbyId] = {
      host: socket.id,
      participants: {},
      state: {
    videoId: null,
    time: 0,
    playing: false
  }
    }
  }

  rooms[lobbyId].participants[socket.id] = {
    socketId: socket.id,
    username: username,
    role: "host"
  }

  socket.join(lobbyId)
  socket.emit("room_created_successfully");
  io.to(lobbyId).emit(
    "participants_list",
    Object.values(rooms[lobbyId].participants)
  )

})

socket.on("join_room", ({code, username})=>{
  console.log("join room is working");  
  if (!rooms[code]) {
        console.log("room does not exist", rooms);
        
    socket.emit("room_error", "Room does not exist")

    return
  }
    socket.join(code)

  rooms[code].participants[socket.id] = {
    socketId: socket.id,
    username: username,
    role: "participant"
  }
    socket.emit("room_joined", { code, username });
    socket.to(code).emit("user_joined", username)
  io.to(code).emit(
    "participants_list",
    Object.values(rooms[code].participants)
  )
    if (rooms[code].state) {
    socket.emit("sync_state", rooms[code].state)
  }
    
})
socket.on("get_participant",({ roomId})=>{
    if (!rooms[roomId]) {
    socket.emit("room_error", "Room does not exist")
    return
  }

  const participants = Object.values(rooms[roomId].participants)

  socket.emit("participants_list", participants)
})
socket.on("change_video", ({ roomId, videoId }) => {
   rooms[roomId].state.videoId = videoId
  rooms[roomId].state.time = 0
  rooms[roomId].state.playing = false

  io.to(roomId).emit("change_video", videoId);

});
socket.on("play", ({ roomId, time }) => {
    const user = rooms[roomId].participants[socket.id]
      if (user.role === "participant") return
   rooms[roomId].state.time = time;
  rooms[roomId].state.playing = true;
  socket.to(roomId).emit("play", { time });
});

socket.on("pause", ({ roomId, time }) => {
   rooms[roomId].state.time = time;
  rooms[roomId].state.playing = true;
  socket.to(roomId).emit("pause", { time });
});

socket.on("seek", ({ roomId, time }) => {
  socket.to(roomId).emit("seek", { time });
});

socket.on("assign_role", ({ roomId, userId, role }) => {

  const room = rooms[roomId]

  if (socket.id !== room.host) return

  room.participants[userId].role = role

  io.to(roomId).emit(
    "participants_list",
    Object.values(room.participants)
  )

})

socket.on("remove_participant", ({ roomId, userId }) => {

  const room = rooms[roomId];

  if (!room) return;

  if (socket.id !== room.host) return;

  delete room.participants[userId];

  const userSocket = io.sockets.sockets.get(userId);

  if (userSocket) {
    userSocket.leave(roomId);
    userSocket.emit("kicked");
  }

  io.to(roomId).emit(
    "participants_list",
    Object.values(room.participants)
  );

});
socket.on("leave_room", ({ roomId }) => {

  if (!rooms[roomId]) return;

  delete rooms[roomId].participants[socket.id];

  socket.leave(roomId);

  io.to(roomId).emit(
    "participants_list",
    Object.values(rooms[roomId].participants)
  );

});
socket.on("send_message", ({ roomId, message }) => {

  const room = rooms[roomId];
  if (!room) return;

  const user = room.participants[socket.id];
  if (!user) return;

  io.to(roomId).emit("receive_message", {
    username: user.username,
    message,
    time: Date.now()
  });

});

  socket.on("disconnect", () => {

  for (let roomId in rooms) {

    if (rooms[roomId].participants[socket.id]) {

      delete rooms[roomId].participants[socket.id]

      io.to(roomId).emit(
        "participants_list",
        Object.values(rooms[roomId].participants)
      )

      if (Object.keys(rooms[roomId].participants).length === 0) {
        delete rooms[roomId]
      }

    }

  }

})
});

}

export default setupSocketServer;