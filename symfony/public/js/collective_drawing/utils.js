
let undoStack = [];
let redoStack = [];
const MAX_HISTORY_SIZE = 10;
let undoButton;
let redoButton;
let clipboard;

// --- Canvas 
export function resizeCanvas(canvas) {
    const newWidth = window.innerWidth / 2;
    const newHeight = window.innerHeight / 1.7;

    const scaleX = newWidth / canvas.width;
    const scaleY = newHeight / canvas.height;

    // Resize every objects on the canvas
    canvas.getObjects().forEach((obj) => {
        obj.scaleX *= scaleX;
        obj.scaleY *= scaleY;
        obj.left *= scaleX;
        obj.top *= scaleY;
        obj.setCoords(); 
    });

    // Resize canvas
    canvas.setDimensions({ width: newWidth, height: newHeight });
    canvas.renderAll();
}

// Delete
export function deleteSelectedObjects(canvas){
    let activeObjects = canvas.getActiveObjects();

    if (activeObjects.length) {            
        activeObjects.forEach(obj => {
            canvas.remove(obj);
        });
        canvas.discardActiveObject();
        canvas.requestRenderAll(); 
    }
}

// Clear all
export function clearCanvas(canvas, backgroundColor) {
    canvas.clear();
    canvas.backgroundColor = backgroundColor;
    saveState(canvas);
    canvas.renderAll();
};

// --- Save canvas

export function downloadCanvas(canvas, format = 'png') {
    const link = document.createElement('a');
    link.href = canvas.toDataURL({format: format, quality: 1});
    link.download = `my_drawing.${format}`;
    link.click();
}
    

// function saveCanvasAsJSON() {
//     const json = JSON.stringify(canvas.toJSON());
//     localStorage.setItem("savedCanvas", json);
// }

// function loadCanvasFromJSON() {
//     const json = localStorage.getItem("savedCanvas");
//     if (json) {
//         canvas.loadFromJSON(json, function () {
//             canvas.renderAll();
//         });
//     }
// }

// --- Undo and redo buttons

document.addEventListener("DOMContentLoaded", function () {
    undoButton = document.getElementById('undo');
    redoButton = document.getElementById('redo');
});

export function saveState(canvas) {
    console.log('savestate');
    let state = JSON.stringify(canvas.toJSON(["backgroundColor"]));
    undoStack.push(state);
    if (undoStack.length > MAX_HISTORY_SIZE) {
        undoStack.shift();
    }
    redoStack = []; // Clear redo stack when a new action is performed
    updateButtons();
    // console.log("undostack -->" + undoStack.length);
    // console.log("redostack -->" + redoStack.length);
}

// --- Undo / Redo historic manager

export function undo(canvas) {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        if (redoStack.length > MAX_HISTORY_SIZE) {
            redoStack.shift();
        }
        loadState(undoStack[undoStack.length - 1], canvas);
    }
    updateButtons();
}

export function redo(canvas) {
    if (redoStack.length > 0) {
        let nextState = redoStack.pop();
        undoStack.push(nextState);
        if (undoStack.length > MAX_HISTORY_SIZE) {
            undoStack.shift();
        }
        loadState(nextState, canvas);
    }
    updateButtons();
}


function loadState(state, canvas) {
    canvas.clear();
    canvas.loadFromJSON(state, function () {
        canvas.renderAll();
        canvas.requestRenderAll();
        updateButtons();
    });
}

function updateButtons() {
    undoButton.disabled = (undoStack.length <= 1);
    redoButton.disabled = (redoStack.length === 0);
    undoButton.classList.toggle("disabled-btn", undoButton.disabled);
    redoButton.classList.toggle("disabled-btn", redoButton.disabled);
}



// --- Copy / Paste systemm

export async function copy(canvas) {    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    try {
        const cloned = await activeObject.clone();
        if (cloned instanceof fabric.ActiveSelection) {
           
            cloned.canvas = canvas;
        }
        clipboard = cloned;
    } catch (error) {
        console.error("Error during cloning:", error);
    }
}

export async function paste(canvas) {
    if (!clipboard) return;

    // console.log('Original clipboard:', clipboard);

    try {
        const clonedObj = await clipboard.clone();

        canvas.discardActiveObject();

        if (clonedObj instanceof fabric.ActiveSelection) {
            clonedObj.canvas = canvas;
            clonedObj.forEachObject((obj) => {
                canvas.add(obj);
            });
            clonedObj.setCoords();
        } else {                
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            canvas.add(clonedObj);
        }
        clipboard = clonedObj;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
        saveState(canvas);
        // console.log('Pasted object:', clonedObj);
    } catch (error) {
        console.error("Error during pasting:", error);
    }
}

// Zoom in / out
    
export function zoomCanvas(canvas, factor) {
    let zoom = canvas.getZoom();
    let newZoom = zoom * factor;

    if (newZoom > 5) newZoom = 5;
    if (newZoom < 0.5) newZoom = 0.5;

    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, newZoom);
}
