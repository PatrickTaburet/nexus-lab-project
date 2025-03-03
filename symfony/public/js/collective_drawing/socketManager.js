const socket = io("http://localhost:3001");
const remoteCursors = {};
const sessionId = "session1";
const userId = "user_" + Math.floor(Math.random() * 10000); 

export { socket };


export function setupSockets(canvas) {

    // Join a session
    socket.emit("join_session", sessionId);

    // Load an existing drawing
    socket.on("load_canvas", (data) => {
        canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });

    // Receive updates and apply them
    socket.on("draw", (data) => {
        // canvas.clear(); 
        canvas.loadFromJSON(data, function() {
            canvas.renderAll();
            // canvas.calcOffset();
            canvas.requestRenderAll();
        });
    });

    // Listen cursor positions
    trackCursorMovement(canvas);
    displayOtherUsersCursor(canvas);

    // Listen to Fabric.js events and send updates
    canvas.on("object:modified", () => { 
        sendCanvasUpdate(canvas);
    });

    canvas.on("path:created", () => { 
        sendCanvasUpdate(canvas);
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
    const cursors = {}; // Store other users' cursors
    console.log("display client");
    socket.on("cursor_move", (data) => {
        console.log( data);
        const { sessionId, pointer } = data;
        // Check if this user's cursor already exists
        if (!cursors[sessionId]) {
           // Check if this user's cursor already exists
            const cursor = new fabric.Circle({
                radius: 5,
                fill: 'red',
                left: pointer.x,
                top: pointer.y,
                originX: 'center',
                originY: 'center'
            });

            cursors[sessionId] = cursor;
            canvas.add(cursor);
        } else {
            // If the cursor exists, update its position
            const cursor = cursors[sessionId];
            cursor.set({ left: pointer.x, top: pointer.y });
            canvas.renderAll();
        }
    });
}

