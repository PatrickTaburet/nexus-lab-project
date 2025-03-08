const Session = require('./public/js/collective_drawing/Session');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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

const sessions = {}; // to stock drawings and users info in session instances

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

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
    
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`WebSocket server listening on http://localhost:${PORT}`);
});