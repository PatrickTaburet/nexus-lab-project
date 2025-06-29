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
const pendingDisconnects = {};

function getOrCreateRoom(roomId, opts) {
    if (!rooms[roomId]) console.log("new room creation");
    if (!rooms[roomId]) rooms[roomId] = new Room(roomId, opts);
    return rooms[roomId];
}

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));

    socket.on('get_room_list', () => {
        socket.emit('room_list', Object.values(rooms).map(r => r.serializeLobby()));
    });

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
        io.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));
        io.to(roomId).emit("room_update", room.serializeLobby());
        // socket.emit("session_state", room.serializeSession());
    });

    socket.on("join_room", ({ roomId, userId, username }) => {
        console.log('join room', roomId, userId, username);
        const room = getOrCreateRoom(roomId);
        if (!room.canJoin(userId)) {
            return console.log("ERROR - IMPOSSIBLE TO JOIN ROOM");
        }
        socket.join(roomId);
        socket.userId = userId;

        if (pendingDisconnects[userId]) {
            console.log(`✅ Reconnexion du créateur ${userId}, annulation du timeout`);
            clearTimeout(pendingDisconnects[userId]);
            delete pendingDisconnects[userId];
        }

        room.addUser(userId, socket.id, username);
        console.log("🧠 Session après addUser :", room.session.users);

        console.log("-----------------");
        console.log(room);


        console.log(`✅ Room ${roomId} has started.`, room.hasStarted);
        // Lobby update
        io.to(roomId).emit("room_update", room.serializeLobby());
        io.to(roomId).emit("update_users", room.session.getUserList());

        // Send actual drawing if exists
        socket.emit("load_canvas", room.session.canvasData);

        // Send other users' positions (and info) to the new user
        Object.entries(room.session.users).forEach(([otherId, user]) => {
            if (String(otherId) !== String(userId)) {
                socket.emit("cursor_move", {
                    roomId: roomId,
                    pointer: {
                        ...user.pointer,
                        userColor: user.color,
                        username: user.username
                    }
                });
            }
        });
        // Send session state (canvas + chat) to new user
        socket.emit("session_state", room.serializeSession());
        io.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));
    });

    socket.on("leave_room", ({ roomId, userId }) => {
        handleUserLeave(socket, roomId, userId, true);
    });

    socket.on("start_room", ({ roomId }) => {
        const room = rooms[roomId];
        if (!room || socket.userId !== room.creator.id) return;
        room.start();
        console.log(`✅ Room ${roomId} has started.`, room.hasStarted); // 👈 log ici

        io.to(roomId).emit("room_started", { roomId });
        io.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));
    });

    // User cursor tracking
    socket.on("cursor_move", ({ roomId, userId, pointer }) => {
        const room = rooms[roomId];
        if (!room || !room.session.users[userId]) return;

        // Update the cursor position for this user in the session
        room.session.users[userId].pointer = pointer;

        // Broadcast the new cursor position to other users in the session
        socket.to(roomId).emit("cursor_move", {
            roomId,
            pointer: {
                ...pointer,
                userColor: room.session.users[userId].color,
                username: room.session.users[userId].username
            }
        });
    });

    // Receive a drawing and broadcast it to the session
    socket.on("draw", ({ roomId, data }) => {
        const room = rooms[roomId];
        if (!room) return;
        //  Store the canvas state
        // if (data.canvasData && data.canvasData.objects && data.canvasData.objects.length > 0) { // TODO : If first player disconnect, clear the session, else keep it intact
        room.session.updateCanvas(data.canvasData);
        socket.to(roomId).emit("draw", { canvasData: data.canvasData }); // Send to others
        // }
    });

    // User disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const roomId in rooms) {
            const room = rooms[roomId];
            const session = room.session;

            if (session.users[socket.userId]) {
                const userId = socket.userId;

                if (userId === room.creator.id) {
                    console.log(`⏳ Créateur déconnecté temporairement, attente avant suppression room ${roomId}`);

                    // Laisse 5 secondes pour qu’il se reconnecte
                    pendingDisconnects[userId] = setTimeout(() => {
                        console.log(`⛔️ Suppression finale room ${roomId} (créateur non revenu)`);
                        handleUserLeave(socket, roomId, userId, true); // FORCÉ
                        delete pendingDisconnects[userId];
                    }, 5000);
                } else {
                    handleUserLeave(socket, roomId, userId);
                }
                break;
            }
        }
    });

    socket.on("get_users", ({ roomId }) => {
        const room = rooms[roomId];
        if (room) {
            socket.emit("update_users", room.session.getUserList());
        } else {
            socket.emit("update_users", []);
        }
    });

    socket.on("send_chat", ({ roomId, message, username, userId, userColor }) => {
        const room = rooms[roomId]
        if (!room) return;
        const chatMessage = { username, message, userColor };
        room.addChat(chatMessage);
        io.to(roomId).emit("update_chat", room.session.chatMessages);
    });

});

function handleUserLeave(socket, roomId, userId, forceDestroy = false) {
    const room = rooms[roomId];
    if (!room) return;

    const session = room.session;

    const isCreator = userId === room.creator.id;

    if (isCreator && (forceDestroy || room.hasStarted)) {
        console.log(`🧨 Room ${roomId} supprimée (créateur quitté${forceDestroy ? " volontairement" : ""})`);

        io.to(roomId).emit("room_closed_by_creator");
        io.in(roomId).socketsLeave(roomId);
        delete rooms[roomId];
    } else {
        if (room.hasStarted) {
            if (session.users[userId]) {
                session.users[userId].online = false;
            }
        } else {
            session.removeUser(userId);
        }
        socket.leave(roomId);

        if (room.currentCount === 0) {
            delete rooms[roomId];
        } else {
            io.to(roomId).emit("update_users", session.getUserList());
            io.to(roomId).emit("room_update", room.serializeLobby());
        }
    }

    io.emit("room_list", Object.values(rooms).map(r => r.serializeLobby()));
}


const PORT = 3001;
server.listen(PORT, () => {
    console.log(`WebSocket server listening on http://localhost:${PORT}`);
});