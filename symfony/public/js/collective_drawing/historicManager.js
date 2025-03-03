import { sendCanvasUpdate } from './socketManager.js'; 


let undoStack = [];
let redoStack = [];
const MAX_HISTORY_SIZE = 10;

// --- Undo / Redo historic manager

export function saveState(canvas) {
    console.log('savestate');
    let state = JSON.stringify(canvas.toJSON());
    undoStack.push(state);
    if (undoStack.length > MAX_HISTORY_SIZE) {
        undoStack.shift();
    }
    redoStack = []; // Clear redo stack when a new action is performed
    updateButtons();
    sendCanvasUpdate(canvas);
    // console.log("undostack -->" + undoStack.length);
    // console.log("redostack -->" + redoStack.length);
}

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
    const undoButton = document.getElementById('undo');
    const redoButton = document.getElementById('redo');
    undoButton.disabled = (undoStack.length <= 1);
    redoButton.disabled = (redoStack.length === 0);
    undoButton.classList.toggle("disabled-btn", undoButton.disabled);
    redoButton.classList.toggle("disabled-btn", redoButton.disabled);
}


