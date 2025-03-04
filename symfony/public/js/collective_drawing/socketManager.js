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
            cursorCanvas.renderAll();
        });
    });

    // Listen cursor positions
    console.log("--------");
    console.log(cursorCanvas);
    
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
    canvas.on('mouse:move', (event) => {
         // Get the cursor position on the canvas
        const pointer = canvas.getPointer(event.e);
        // console.log(pointer);
        
        // Send the cursor position to all other users via Socket.io
        socket.emit("cursor_move", { sessionId, pointer });
    });
}

// Add a user's cursor to the screen
function displayOtherUsersCursor(canvas) {
    console.log("display client");
    socket.off("cursor_move");  
    socket.on("cursor_move", (data) => {
        console.log( data);
        const { sessionId, pointer } = data;
        // Check if this user's cursor already exists
        if (!cursors[sessionId]) {
           // Check if this user's cursor already exists
            const cursor = new fabric.Circle({
                radius: 5,
                fill: pointer.color || 'white',  
                left: pointer.x,
                top: pointer.y,
                originX: 'center',
                originY: 'center',
                originY: 'center',
                selectable: false, 
                evented: false 
            });

            cursors[sessionId] = cursor;
            canvas.add(cursor);
        } else {
            // If the cursor exists, update its position
            const cursor = cursors[sessionId];
            cursor.set({ left: pointer.x, top: pointer.y });
        }
        canvas.renderAll();

    });
    // socket.on("load_canvas", () => {
    //     Object.values(cursors).forEach(cursor => canvas.add(cursor));
    //     canvas.renderAll();
    // });
}

