const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { log } = require("console");
const usersColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 10e6,
});

const sessions = {}; // to stock drawings and users info in session

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("join_session", ({ sessionId, username, userId }) => {
        socket.join(sessionId);
        socket.userId = userId;
        
        console.log(`${username} (${socket.id}) join the session ${sessionId}`);
        // Init session
        if (!sessions[sessionId]) {
            sessions[sessionId] = {
                canvasData: null,   
                users: {}
            };
        }

        // Si l'utilisateur existe déjà, on met simplement à jour son socketId
        if (sessions[sessionId].users[userId]) {
            sessions[sessionId].users[userId].socketId = socket.id;
            sessions[sessionId].users[userId].online = true;
        } else {
            // Sinon, on ajoute l'utilisateur et on lui assigne une couleur
            const userCount = Object.keys(sessions[sessionId].users).length;
            const userColor = usersColors[userCount % usersColors.length];
            sessions[sessionId].users[userId] = {
                socketId: socket.id,
                username: username,
                userId: userId,
                color: userColor,
                pointer: { x: 0, y: 0, isClicking: false },
                online: true
            };
        }
        broadcastUserList(sessionId);

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
            sessions[sessionId] = { canvasData: null, users: {} };
        }
        // console.log(sessions[sessionId] );
        //  Store the canvas state
        // if (data.canvasData && data.canvasData.objects && data.canvasData.objects.length > 0) { // TODO : If first player disconnect, clear the session, else keep it intact
        sessions[sessionId].canvasData = data.canvasData;
        socket.to(sessionId).emit("draw", { canvasData: data.canvasData }); // Send to others
        // }
    });

    // User disconnection
    socket.on("disconnect", () => {
        console.log(`Utilisateur déconnecté: ${socket.id}`);
        for (const sessionId in sessions) {            
            if (sessions[sessionId] && sessions[sessionId].users[socket.userId]){
                // delete sessions[sessionId].users[socket.userId];
                sessions[sessionId].users[socket.userId].online = false;
                broadcastUserList(sessionId);
                break;
            }
        }
    });

    socket.on("get_users", ({ sessionId }) => {
        if (sessions[sessionId]) {
            const userList = Object.values(sessions[sessionId].users).map(user => ({
                username: user.username,
                userColor: user.color,
                isOnline: user.online
            }));
            // Envoyer la liste au socket qui demande
            console.log("get user server");
            console.log(userList);
            
            socket.emit("update_users", userList);
        } else {
            socket.emit("update_users", []);
        }
    });
    
});

function broadcastUserList(sessionId) {
    const userList = Object.values(sessions[sessionId].users).map(user => ({
      username: user.username,
      userColor: user.color,
      isOnline : user.online
    }));
    console.log("--------");
    console.log("server broadcast userList");
    console.log(userList);
    
    io.to(sessionId).emit("update_users", userList);
}

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Serveur WebSocket en écoute sur http://localhost:${PORT}`);
});