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
        redoStack = [];
        undoStack.push(JSON.stringify(canvas.toJSON(['backgroundColor'])));
    }

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
        saveState();
        let rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: "blue",
            width: 80,
            height: 60
        });
        canvas.add(rect);
    };

    // Add Circle
    window.addCircle = function () {
        saveState();
        let circle = new fabric.Circle({
            left: 150,
            top: 150,
            radius: 40,
            fill: "red"
        });
        canvas.add(circle);
    };

    // Undo last action
    window.undo = function () {
        if (undoStack.length > 1) {
            redoStack.push(undoStack.pop());
            let previousState = undoStack[undoStack.length - 1];
            canvas.loadFromJSON(previousState, function () {
                canvas.renderAll();
            });
        }
    };

    // Redo last action
    window.redo = function () {
        if (redoStack.length > 0) {
            let nextState = redoStack.pop();
            undoStack.push(nextState);
            canvas.loadFromJSON(nextState, function () {
                canvas.renderAll();
            });
        }
    };

    // Clear all
    window.clearCanvas = function () {
        saveState();
        canvas.clear();
        canvas.backgroundColor = "#fff";
        canvas.renderAll();
    };

    // Saving canvas state after each modification
    canvas.on("object:added", saveState);
    canvas.on("object:modified", saveState);
    canvas.on("object:removed", saveState);
    canvas.on("path:created", saveState);
});
