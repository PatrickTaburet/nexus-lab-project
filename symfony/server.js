const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 10e6,
});

const sessions = {}; // to stock drawings in session

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("join_session", (sessionId) => {
        socket.join(sessionId);
        console.log(`${socket.id} join the session ${sessionId}`);

        // Init session
        if (!sessions[sessionId]) {
            sessions[sessionId] = {
                canvasData: null,   
                cursors: {} 
            };
        }

        // Init cursos position fot this new user
        if (!sessions[sessionId].cursors) {
            sessions[sessionId].cursors = {};
        }
        // Send actual drawing if exists
        socket.emit("load_canvas", sessions[sessionId]);
        // If users are already in the sessions, send there cursor position
        Object.keys(sessions[sessionId].cursors).forEach(userSocketId => {
            socket.emit("cursor_move", { sessionId, pointer: sessions[sessionId].cursors[userSocketId] });
        });


        sessions[sessionId].cursors[socket.id] = { x: 0, y: 0 };
    });

    // User cursor tracking
    socket.on("cursor_move", (data) => {
        // console.log("cursor move server");
        // console.log(data);

        const { sessionId, pointer } = data;

        // Update the cursor position for this user in the session
        if (sessions[sessionId]) {
            if (!sessions[sessionId].cursors) {
                sessions[sessionId].cursors = {}; 
            }
            sessions[sessionId].cursors[socket.id] = pointer;
            // Broadcast the new cursor position to other users in the session
            socket.to(sessionId).emit("cursor_move", data);
        }
    });

    // Receive a drawing and broadcast it to the session
    socket.on("draw", ({ sessionId, data }) => {
        sessions[sessionId] = data; //  Store the canvas state
        socket.to(sessionId).emit("draw", data); // Send to others
    });

    // User disconnection
    socket.on("disconnect", () => {
        console.log(`Utilisateur déconnecté: ${socket.id}`);
        for (const sessionId in sessions) {
            if (sessions[sessionId].cursors[socket.id]) {
                delete sessions[sessionId].cursors[socket.id];
                break;
            }
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Serveur WebSocket en écoute sur http://localhost:${PORT}`);
});
