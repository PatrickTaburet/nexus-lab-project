const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
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

    socket.on("join_session", (sessionId) => {
        socket.join(sessionId);
        console.log(`${socket.id} join the session ${sessionId}`);

        // Init session
        if (!sessions[sessionId]) {
            sessions[sessionId] = {
                canvasData: null,   
                users: {}
            };
        }
        const userIndex = Object.keys(sessions[sessionId].users).length;
        const userColor = usersColors[userIndex % usersColors.length];
        sessions[sessionId].users[socket.id] = {
            socketId: socket.id,
            username: socket.id,  
            color: userColor,
            pointer: { x: 0, y: 0, isClicking: false }
        };
        
        // Send actual drawing if exists
        socket.emit("load_canvas", sessions[sessionId].canvasData);

        // Send other users' positions (and info) to the new user
        Object.keys(sessions[sessionId].users).forEach(otherSocketId  => {
            if (otherSocketId !== socket.id) {
                const user = sessions[sessionId].users[otherSocketId];
                socket.emit("cursor_move", {
                    sessionId,
                    pointer: {
                        ...user.pointer,
                        userColor: user.userColor,
                        username: user.username
                    }
                });
            }
        });
    });

    // User cursor tracking
    socket.on("cursor_move", (data) => {
        const { sessionId, pointer } = data;

        // Update the cursor position for this user in the session
        if (sessions[sessionId] && sessions[sessionId].users[socket.id]){
            sessions[sessionId].users[socket.id].pointer = pointer;

            // Broadcast the new cursor position to other users in the session
            socket.to(sessionId).emit("cursor_move", {
                sessionId,
                pointer: {
                    ...pointer,
                    userColor: sessions[sessionId].users[socket.id].color,
                    username: sessions[sessionId].users[socket.id].username
                }
            });
        }
    });

    // Receive a drawing and broadcast it to the session
    socket.on("draw", ({ sessionId, data }) => {
        if (!sessions[sessionId]) {
            sessions[sessionId] = { canvasData: null, users: {} };
        }
        console.log("--------");
        console.log(sessions[sessionId] );
        //  Store the canvas state
        sessions[sessionId].canvasData = data.canvasData;

        socket.to(sessionId).emit("draw", { canvasData: data.canvasData }); // Send to others
    });

    // User disconnection
    socket.on("disconnect", () => {
        console.log(`Utilisateur déconnecté: ${socket.id}`);
        for (const sessionId in sessions) {            
            if (sessions[sessionId] && sessions[sessionId].users[socket.id]){
                delete sessions[sessionId].users[socket.id];
                break;
            }
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Serveur WebSocket en écoute sur http://localhost:${PORT}`);
});