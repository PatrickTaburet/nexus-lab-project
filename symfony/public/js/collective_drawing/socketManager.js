const socket = io("http://localhost:3001");
const sessionId = "session1";
const userId = "user_" + Math.floor(Math.random() * 10000); 
const cursors = {}; // Store other users cursors

export { socket };


export function setupSockets(drawingCanvas, cursorCanvas) {
    // Join a session
    socket.emit("join_session", sessionId);

    // Load an existing drawing
    socket.on("load_canvas", (data) => {
        drawingCanvas.loadFromJSON(data, drawingCanvas.renderAll.bind(drawingCanvas));
    });

    // Receive updates and apply them
    socket.on("draw", (data) => {
        // canvas.clear(); 
        drawingCanvas.loadFromJSON(data, function() {
            drawingCanvas.renderAll();
            // canvas.calcOffset();
            // displayOtherUsersCursor(drawingCanvas);
            drawingCanvas.requestRenderAll();
        });
    });

    // Listen cursor positions
    // console.log("--------");
    // console.log(cursorCanvas);
    
    trackCursorMovement(cursorCanvas);
    displayOtherUsersCursor(cursorCanvas);

    // Listen to Fabric.js events and send updates
    drawingCanvas.on("object:modified", () => { 
        sendCanvasUpdate(drawingCanvas);
    });

    drawingCanvas.on("path:created", () => { 
        sendCanvasUpdate(drawingCanvas);
    });

    // canvas.on("object:added", () => { 
    // });
    // canvas.on("object:removed", () => { 
    // });
}

export function sendCanvasUpdate(canvas) {
    const data = canvas.toJSON(['src']);
    socket.emit("draw", { sessionId, data });
}

function trackCursorMovement(canvas) {
    let isClicking = false;

    document.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const pointer = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            isClicking: isClicking
        };

        // Send position to others
        socket.emit("cursor_move", { sessionId, pointer });
    });

    document.addEventListener('mousedown', () => {
        isClicking = true;
    });
    document.addEventListener('mouseup', () => {
        isClicking = false;
    });

}

// Add a user's cursor to the screen
function displayOtherUsersCursor(canvas) {
    const ctx = canvas.getContext("2d");
    socket.off("cursor_move");  
    socket.on("cursor_move", (data) => {
        const { pointer } = data;

        // Efface l'ancien dessin
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessine le curseur des autres utilisateurs
        ctx.fillStyle = pointer.isClicking ? "#ff000067" : "red"; 
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, pointer.isClicking ? 7 : 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

