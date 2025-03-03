const socket = io("http://localhost:3001"); // Connexion au serveur WebSocke
const sessionId = "session1"
export { socket };

export function setupSockets(canvas) {

    // Rejoindre une session
    socket.emit("join_session", sessionId);

    // Charger un dessin existant
    socket.on("load_canvas", (data) => {
        canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });

    // Recevoir les mises à jour et les appliquer
    socket.on("draw", (data) => {
        canvas.clear(); // Supprime tous les objets avant de recharger
        canvas.loadFromJSON(data, function() {
            canvas.renderAll();
            canvas.calcOffset();
            canvas.requestRenderAll(); // Force le rendu total
        });
    });


    // Écouter les événements Fabric.js et envoyer les mises à jour
    canvas.on("object:modified", () => { 
        sendCanvasUpdate(canvas);
    });

    canvas.on("path:created", () => { 
        sendCanvasUpdate(canvas);
    });

    // Optionnel : Éviter le clignotement en ajoutant un petit délai
    // canvas.on("object:added", () => { 
    //     setTimeout(sendCanvasUpdate, 50);
    // });

    // canvas.on("object:removed", () => { 
    //     setTimeout(sendCanvasUpdate, 50);
    // });
}

export function sendCanvasUpdate(canvas) {
    const data = canvas.toJSON();
    socket.emit("draw", { sessionId, data });
}