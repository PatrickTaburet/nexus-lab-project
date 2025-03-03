const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",  // Autoriser toutes les origines (change en prod)
        methods: ["GET", "POST"]
    }
});

const sessions = {}; // Stocke les dessins par session

io.on("connection", (socket) => {
    console.log("Nouvel utilisateur connecté:", socket.id);

    // Rejoindre une session
    socket.on("join_session", (sessionId) => {
        socket.join(sessionId);
        console.log(`${socket.id} a rejoint la session ${sessionId}`);

        // Envoyer le dessin actuel s'il existe
        if (sessions[sessionId]) {
            socket.emit("load_canvas", sessions[sessionId]);
        }
    });

    // Recevoir un dessin et le diffuser à la session
    socket.on("draw", ({ sessionId, data }) => {
        sessions[sessionId] = data; // Stocke l'état du canvas
        socket.to(sessionId).emit("draw", data); // Envoie aux autres
    });

    // Déconnexion de l'utilisateur
    socket.on("disconnect", () => {
        console.log(`Utilisateur déconnecté: ${socket.id}`);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Serveur WebSocket en écoute sur http://localhost:${PORT}`);
});
