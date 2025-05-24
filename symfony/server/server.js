// const Session = require('../public/js/collective_drawing/Session');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Room = require('./Room');
const cors = require("cors");
const { log } = require("console");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 10e6,
});

const rooms = {};

function getOrCreateRoom(roomId, opts = {}) {
    if (!rooms[roomId]) rooms[roomId] = new Room(roomId, opts);
    return rooms[roomId];
}

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));

    socket.on("create_room", ({ roomId, name, maxPlayers }) => {
        const room = getOrCreateRoom(roomId, { name, maxPlayers });
        io.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));
    });

    socket.on("join_room", ({ roomId, userId, username }) => {
        const room = getOrCreateRoom(roomId);
        if (!room.canJoin()) {
            return socket.emit("error", "Impossible to join this room");
        }
        socket.join(roomId);
        socket.userId = userId;
        room.addUser(userId, socket.id, username);

        // Lobby update
        io.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));
        io.to(roomId).emit("room_update", room.serializeLobby());

        // Send session state (canvas + chat) to new user
        socket.emit("session_state", room.serializeSession());
    });

    socket.on("leave_room", ({ roomId, userId }) => {
        const room = rooms[roomId];
        if (!room) return;
        room.removeUser(userId);
        socket.leave(roomId);

        if (room.currentCount === 0) {
            delete rooms[roomId];
        } else {
            io.to(roomId).emit("room_update", room.serializeLobby());
        }
        io.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));
    });

    socket.on("start_room", ({ roomId }) => {
        const room = rooms[roomId];
        if (!room) return;
        room.start();
        io.to(roomId).emit("room_started", { roomId });
        io.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));
    });



    socket.on("join_session", ({ sessionId, username, userId }) => {
        socket.join(sessionId);
        socket.userId = userId;
        
        console.log(`${username} (${socket.id}) join the session ${sessionId}`);
        // Init session
        if (!sessions[sessionId]) {
            sessions[sessionId] = new Session(sessionId);
        }

        sessions[sessionId].addUser(userId, socket.id, username);
        io.to(sessionId).emit("update_users", sessions[sessionId].getUserList());

        // Send actual drawing if exists
        socket.emit("load_canvas", sessions[sessionId].canvasData);

        // Send other users' positions (and info) to the new user
        Object.keys(sessions[sessionId].users).forEach(otherUserId   => {
            if (otherUserId  !== userId) {
                const user = sessions[sessionId].users[otherUserId];
                socket.emit("cursor_move", {
                    sessionId,
                    pointer: {
                        ...user.pointer,
                        userColor: user.color,
                        username: user.username
                    }
                });
            }
        });
    });

    // User cursor tracking
    socket.on("cursor_move", (data) => {
        const { sessionId, userId, pointer } = data;
        
        // Update the cursor position for this user in the session
        if (sessions[sessionId] && sessions[sessionId].users[userId]){
            sessions[sessionId].users[userId].pointer = pointer;

            // Broadcast the new cursor position to other users in the session
            socket.to(sessionId).emit("cursor_move", {
                sessionId,
                pointer: {
                    ...pointer,
                    userColor: sessions[sessionId].users[userId].color,
                    username: sessions[sessionId].users[userId].username
                }
            });
        }
    });

    // Receive a drawing and broadcast it to the session
    socket.on("draw", ({ sessionId, data }) => {
        if (!sessions[sessionId]) {
            sessions[sessionId] = new Session(sessionId);
        }
        // console.log(sessions[sessionId] );
        //  Store the canvas state
        // if (data.canvasData && data.canvasData.objects && data.canvasData.objects.length > 0) { // TODO : If first player disconnect, clear the session, else keep it intact
        sessions[sessionId].updateCanvas(data.canvasData);
        socket.to(sessionId).emit("draw", { canvasData: data.canvasData }); // Send to others
        // }
    });

    // User disconnection
    socket.on("disconnect", () => {
        console.log(`User disconected: ${socket.id}`);
        for (const sessionId in sessions) {            
            if (sessions[sessionId] && sessions[sessionId].users[socket.userId]){
                // delete sessions[sessionId].users[socket.userId];
                sessions[sessionId].removeUser(socket.userId);
                io.to(sessionId).emit("update_users", sessions[sessionId].getUserList());
                break;
            }
        }
    });

    socket.on("get_users", ({ sessionId }) => {
        if (sessions[sessionId]) {
            socket.emit("update_users", sessions[sessionId].getUserList());         
        } else {
            socket.emit("update_users", []);
        }
    });

    socket.on("send_chat", ({sessionId, message, username, userId, userColor}) => {
        const chatMessage = { username, message, userColor };
        if (!sessions[sessionId].chatMessages) {
            sessions[sessionId].chatMessages = [];
        }
        sessions[sessionId].chatMessages.push(chatMessage);
        io.to(sessionId).emit("update_chat", sessions[sessionId].chatMessages);
    });
    
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`WebSocket server listening on http://localhost:${PORT}`);
});