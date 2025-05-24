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

    socket.on("create_room", ({ roomId, name, maxPlayers, userId, username }) => {
        const room = getOrCreateRoom(roomId, {
            name,
            maxPlayers,
            creator: {
                username: username,
                id: userId
            }

        });
        socket.userId = userId;
        socket.join(roomId);
        room.addUser(userId, socket.id, username);
        // room.creator = userId;
        io.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));
        io.to(roomId).emit("room_update", room.serializeLobby());
        socket.emit("session_state", room.serializeSession());
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

        // socket.emit("join_success", { roomId, isFromLobby });
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

        const room = rooms[sessionId];
        if (!room) {
            return socket.emit("error", "Session not found.");
        }

        const session = room.session;
        socket.join(sessionId);
        socket.userId = userId;

        console.log(`${username} (${socket.id}) joined the session ${sessionId}`);

        // Ajout de l'utilisateur dans la session
        session.addUser(userId, socket.id, username);

        // Envoi des utilisateurs mis à jour à tout le monde
        io.to(sessionId).emit("update_users", session.getUserList());

        // Send actual drawing if exists
        socket.emit("load_canvas", session.canvasData);

        // Send other users' positions (and info) to the new user
        Object.keys(session.users).forEach(otherUserId   => {
            if (otherUserId  !== userId) {
                const user = session.users[otherUserId];
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
    socket.on("cursor_move", ({ sessionId, userId, pointer }) => {
        const room = rooms[sessionId];
        if (!room || !room.session.users[userId]) return;

        // Update the cursor position for this user in the session
        room.session.users[userId].pointer = pointer;

        // Broadcast the new cursor position to other users in the session
        socket.to(sessionId).emit("cursor_move", {
            sessionId,
            pointer: {
                ...pointer,
                userColor: room.session.users[userId].color,
                username: room.session.users[userId].username
            }
        });
    });

    // Receive a drawing and broadcast it to the session
    socket.on("draw", ({ sessionId, data }) => {
        const room = rooms[sessionId];
        if (!room) return;
        // console.log(sessions[sessionId] );
        //  Store the canvas state
        // if (data.canvasData && data.canvasData.objects && data.canvasData.objects.length > 0) { // TODO : If first player disconnect, clear the session, else keep it intact
        room.session.updateCanvas(data.canvasData);
        socket.to(sessionId).emit("draw", { canvasData: data.canvasData }); // Send to others
        // }
    });

    // User disconnection
    socket.on("disconnect", () => {
        console.log(`User disconected: ${socket.id}`);
        for (const roomId in rooms) {
            const room = rooms[roomId];
            const session = room.session;

            if (session.users[socket.userId]){
                // delete sessions[sessionId].users[socket.userId];
                session.removeUser(socket.userId);
                if (room.currentCount === 0) {
                    delete rooms[roomId]; // optionnel : suppression de la room vide
                } else {
                    io.to(roomId).emit("update_users", session.getUserList());
                }
                break;
            }
        }
    });

    socket.on("get_users", ({ sessionId }) => {
        const room = rooms[sessionId];
        if (room) {
            socket.emit("update_users", room.session.getUserList());
        } else {
            socket.emit("update_users", []);
        }
    });

    socket.on("send_chat", ({sessionId, message, username, userId, userColor}) => {
        const room = rooms[sessionId];
        if (!room) return;

        const chatMessage = { username, message, userColor };
        if (!room.session.chatMessages) {
            room.session.chatMessages = [];
        }
        room.session.chatMessages.push(chatMessage);
        io.to(sessionId).emit("update_chat", room.session.chatMessages);
    });
    
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`WebSocket server listening on http://localhost:${PORT}`);
});