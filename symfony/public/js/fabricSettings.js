document.addEventListener("DOMContentLoaded", function () {
    // Undo/Redo historic
    let undoStack = [];
    let redoStack = [];
    let brushcolor = "black";
    let brushSize = 5;
    const MAX_HISTORY_SIZE = 10;

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

    function saveState() {
        console.log('savestate');
        let state = JSON.stringify(canvas.toJSON(["backgroundColor"]));
        undoStack.push(state);
        if (undoStack.length > MAX_HISTORY_SIZE) {
            undoStack.shift();
        }
        redoStack = []; // Clear redo stack when a new action is performed
        updateButtons();
        console.log("undostack -->" + undoStack.length);
        console.log("redostack -->" + redoStack.length);
    }

    function undo() {
        if (undoStack.length > 1) {
            console.log(undoStack.length);

            redoStack.push(undoStack.pop());
            if (redoStack.length > MAX_HISTORY_SIZE) {
                redoStack.shift();
            }
            loadState(undoStack[undoStack.length - 1]);
        }
        updateButtons();
        console.log("undostack -->" + undoStack.length);
        console.log("redostack -->" + redoStack.length);
    }

    function redo() {
        if (redoStack.length > 0) {
            let nextState = redoStack.pop();
            undoStack.push(nextState);
            if (undoStack.length > MAX_HISTORY_SIZE) {
                undoStack.shift();
            }
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
        canvas.freeDrawingBrush.color = brushcolor;
        canvas.freeDrawingBrush.width = brushSize;
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

    // Clear all
    window.clearCanvas = function () {
        canvas.clear();
        canvas.backgroundColor = "#fff";
        saveState();
        canvas.renderAll();
    };

    // Undo and redo buttons
    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('redo').addEventListener('click', redo);

    // Tools buttons 
    document.getElementById("rectangleButton").addEventListener("click", addRectangle);
    document.getElementById("circleButton").addEventListener("click", addCircle);
    document.getElementById("clearCanvasButton").addEventListener("click", clearCanvas);
    // document.getElementById("lineButton").addEventListener("click", setLine);
    // document.getElementById("textButton").addEventListener("click", setText);

    // Color picker
    document.getElementById("backgroundColorPicker").addEventListener("input", function (event) {
        let newColor = event.target.value;
        canvas.backgroundColor = newColor;
        canvas.renderAll();
        saveState();
    });

    // Brush settings
    document.getElementById("brushColorPicker").addEventListener("input", function(event){
        brushcolor = event.target.value;
        activateBrushMode();
        canvas.renderAll();
    });
    
    document.getElementById("brushSizeSlider").addEventListener("input", function(event){
        brushSize = Number(event.target.value);
        activateBrushMode();
        canvas.renderAll();
    });

    const buttons = document.querySelectorAll('.tool-btn');

    function activateBrushMode() {
        const selectButton = document.getElementById('selectButton');
        const brushButton = document.getElementById('brushButton');
        const eraserButton = document.getElementById('eraserButton');
        selectButton.classList.remove('disabled-btn');
        selectButton.disabled = false;
        brushButton.classList.add('disabled-btn');
        brushButton.disabled = true;
        eraserButton.classList.add('disabled-btn');
        eraserButton.disabled = false;
        setBrush();
    }
      
    function handleButtonClick(event) {
        buttons.forEach(button => {
            if (button === event.target) {
                button.classList.add('disabled-btn');
                button.disabled = true;
            } else {
                button.classList.remove('disabled-btn');
                button.disabled = false;
            }
        });
        
        switch (event.target.id) {
            case 'selectButton':
                setSelectionMode();
                break;
            case 'eraserButton':
                setEraser();
                break;
            case 'brushButton':
                activateBrushMode();
                break;
            default:
                break;
        } 
    }
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
    // Saving canvas state after each modification
    canvas.on("object:modified", saveState);
    canvas.on("path:created", saveState);
    // canvas.on("object:added", saveState);
    // canvas.on("object:removed", saveState);
});
