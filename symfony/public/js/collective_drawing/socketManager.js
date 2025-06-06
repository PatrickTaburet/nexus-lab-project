const socket = window.socket;
const roomId   = window.roomId;

// Get session id
// const urlParts = window.location.pathname.split("/");
// const sessionId = urlParts[urlParts.length - 1];
const cursors = {};
const currentUser = window.currentUser;
console.log("socket manager");
console.log(socket);
export function setupSockets(drawingCanvas, cursorCanvas) {
    // Join a session
    socket.emit("join_room", {
        roomId,
        userId:   currentUser.id,
        username: currentUser.username
    });

    // Load an existing drawing
    socket.on("load_canvas", (canvasData) => {
        if (canvasData){
            drawingCanvas.loadFromJSON(canvasData, drawingCanvas.renderAll.bind(drawingCanvas));
            drawingCanvas.requestRenderAll();
        }
    });

    // Receive updates and apply them
    socket.on("draw", ({ canvasData }) => {
        // canvas.clear();
        drawingCanvas.loadFromJSON(canvasData, function() {
            drawingCanvas.renderAll();
            drawingCanvas.requestRenderAll();
        });
    });

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
    const data = { canvasData: canvas.toJSON() };
    socket.emit("draw", { roomId, data });
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
        socket.emit("cursor_move", { roomId, userId: currentUser.id, pointer });
    });

    document.addEventListener('mousedown', () => { isClicking = true; });
    document.addEventListener('mouseup', () => { isClicking = false; });

}

// Add a user's cursor to the screen
function displayOtherUsersCursor(canvas) {
    
    const ctx = canvas.getContext("2d");
    socket.off("cursor_move");  
    socket.on("cursor_move", (data) => {
        const { pointer } = data;
        if (pointer.username) {
            cursors[pointer.username] = pointer;
        }
        redrawCursors(ctx, canvas);
    });
}

function redrawCursors(ctx, canvas) {
    // Delete the cursor of the canva
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // for each user, draw his cursor
    Object.keys(cursors).forEach(key => {
        const p = cursors[key];
        ctx.fillStyle = p.userColor; 
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.isClicking ? 7 : 5, 0, Math.PI * 2);
        ctx.fill();
    });
}