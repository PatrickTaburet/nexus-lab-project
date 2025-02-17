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
    // current unsaved state
    let state;

    // Undo/Redo historic
    let undoStack = [];
    let redoStack = [];

    function saveState() {
        redoStack = [];
        document.getElementById('redo').disabled = true;
        if (state) {
            undoStack.push(state);
            document.getElementById('undo').disabled = false;
        }
        state = JSON.stringify(canvas.toJSON(["backgroundColor"]));

    }
    
    function replay(playStack, saveStack, buttonsOn, buttonsOff) {
        console.log(playStack.length );
        
            saveStack.push(state);
            state = playStack.pop();

            document.querySelector(buttonsOn).disabled = true;
            document.querySelector(buttonsOff).disabled = true;

            canvas.clear();
            canvas.loadFromJSON(state, function () {
                canvas.renderAll();
                // Réactiver les boutons une fois l'état chargé
                document.querySelector(buttonsOn).disabled = false;
                if (playStack.length) {
                    document.querySelector(buttonsOff).disabled = false;
                }
            });  
      
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
        // saveState(); 
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
        // saveState(); 
    };

    document.getElementById("backgroundColorPicker").addEventListener("input", function (event) {
        let newColor = event.target.value;
        canvas.backgroundColor = newColor;
        canvas.renderAll();
        saveState();
    });


    // Boutons undo et redo
    document.getElementById('undo').addEventListener('click', function () {
        replay(undoStack, redoStack, '#redo', '#undo'); 
    });

    document.getElementById('redo').addEventListener('click', function () {
        replay(redoStack, undoStack, '#undo', '#redo'); 
    });

    // Saving canvas state after each modification
    canvas.on("object:added", saveState);
    canvas.on("object:modified", saveState);
    canvas.on("object:removed", saveState);
    canvas.on("path:created", saveState);
    
    // Clear all
    window.clearCanvas = function () {
        canvas.clear();
        canvas.backgroundColor = "#fff";
        saveState();
        canvas.renderAll();
    };
});
