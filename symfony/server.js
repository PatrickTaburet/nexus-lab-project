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
        const userColor = getRandomColor();
        
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
        sessions[sessionId].cursors[socket.id] = { x: 0, y: 0, color: userColor };


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
            
            if (!sessions[sessionId].cursors[socket.id]) {
                sessions[sessionId].cursors[socket.id] = { color: getRandomColor() };
            }
    
            sessions[sessionId].cursors[socket.id] = { 
                ...pointer, 
                color: sessions[sessionId].cursors[socket.id].color 
            };
            // console.log(socket.id);
            // Broadcast the new cursor position to other users in the session
            socket.to(sessionId).emit("cursor_move", { sessionId, pointer: sessions[sessionId].cursors[socket.id] });
        }
    });

    // Receive a drawing and broadcast it to the session
    socket.on("draw", ({ sessionId, data }) => {
        if (!sessions[sessionId]) {
            sessions[sessionId] = { canvasData: null, cursors: {} };
        }
        //  Store the canvas state
        sessions[sessionId] = {
            ...sessions[sessionId],  // keep the cursors
            ...data                  // Replace canvasData only
        }; 
        socket.to(sessionId).emit("draw", data); // Send to others
    });

    // User disconnection
    socket.on("disconnect", () => {
        console.log(`Utilisateur déconnecté: ${socket.id}`);
        for (const sessionId in sessions) {
            console.log("sessions[sessionId]s");
            console.log(sessions[sessionId]);
            
            if (sessions[sessionId] && sessions[sessionId].cursors && sessions[sessionId].cursors[socket.id]) {
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

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}