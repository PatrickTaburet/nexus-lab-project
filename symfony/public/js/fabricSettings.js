document.addEventListener("DOMContentLoaded", function () {
    if (typeof fabric === "undefined") {
        console.error("Fabric.js is not loaded!");
        return;
    }

    // Canvas init
    const canvas = new fabric.Canvas("drawingCanvas", {
        width: 800,
        height: 500,
        isDrawingMode: false
    });

    // Undo/Redo historic
    let undoStack = [];
    let redoStack = [];

    function saveState() {
        console.log('savestate');
        let state = JSON.stringify(canvas.toJSON(["backgroundColor"]));
        undoStack.push(state);
        redoStack = []; // Clear redo stack when a new action is performed
        updateButtons();
        console.log("undostack -->" + undoStack.length);
        console.log("redostack -->" + redoStack.length);
    }

    function undo() {
        if (undoStack.length > 1) {
            console.log(undoStack.length);

            let currentState = undoStack.pop();
            redoStack.push(currentState);
            let previousState = undoStack[undoStack.length - 1];
            loadState(previousState);
        }
        updateButtons();
        console.log("undostack -->" + undoStack.length);
        console.log("redostack -->" + redoStack.length);
    }

    function redo() {
        if (redoStack.length > 0) {
            let nextState = redoStack.pop();
            undoStack.push(nextState);
            loadState(nextState);
        }
        updateButtons();
        console.log("undostack -->" + undoStack.length);
        console.log("redostack -->" + redoStack.length);
    }

    function loadState(state) {
        canvas.clear();
        canvas.loadFromJSON(state, function () {
            canvas.renderAll();
             canvas.requestRenderAll();
            updateButtons();
        });
    }

    function updateButtons() {
        document.getElementById('undo').disabled = (undoStack.length <= 1);
        document.getElementById('redo').disabled = (redoStack.length === 0);
    }
    // Save the initial state
    saveState();

    // Activate select mode
    window.setSelectionMode = function () {
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.forEachObject(obj => obj.selectable = true);
        console.log("Mode sélection activé !");
    };

    // Activate brush mode
    window.setBrush = function () {
        canvas.isDrawingMode = true;
        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = "black";
        canvas.freeDrawingBrush.width = 5;
        console.log("Pinceau activé !");
    };

    // Activate Eraser
    window.setEraser = function () {
        canvas.isDrawingMode = true;
        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = "#fff"; // Eraser = white background
        canvas.freeDrawingBrush.width = 10;
        console.log("Gomme activée !");
    };

    // Add Rectangle
    window.addRectangle = function () {
        let rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: "blue",
            width: 80,
            height: 60
        });
        canvas.add(rect);
        saveState();

    };

    // Add Circle
    window.addCircle = function () {
        let circle = new fabric.Circle({
            left: 150,
            top: 150,
            radius: 40,
            fill: "red"
        });
        canvas.add(circle);
        saveState();

    };

    document.getElementById("backgroundColorPicker").addEventListener("input", function (event) {
        let newColor = event.target.value;
        canvas.backgroundColor = newColor;
        canvas.renderAll();
        saveState();
    });


    // Undo and redo buttons
    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('redo').addEventListener('click', redo);

    // Saving canvas state after each modification
    
    // canvas.on("object:added", saveState);
    canvas.on("object:modified", saveState);
    // canvas.on("object:removed", saveState);
    canvas.on("path:created", saveState);
    
    // Clear all
    window.clearCanvas = function () {
        canvas.clear();
        canvas.backgroundColor = "#fff";
        saveState();
        canvas.renderAll();
    };
});
