document.addEventListener("DOMContentLoaded", function () {
    let undoStack = [];
    let redoStack = [];
    let brushColor = "black";
    let textColor = "black";
    let brushSize = 5;
    let eraserSize = 10;
    let textValue;
    let imageFile;
    const MAX_HISTORY_SIZE = 10;

    if (typeof fabric === "undefined") {
        console.error("Fabric.js is not loaded!");
        return;
    }

    // --- Canvas init
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

    // --- Undo / Redo historic manager

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

    // --- Save the initial state
    saveState();

    // --- Activate select mode
    function setSelectionMode() {
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.forEachObject(obj => obj.selectable = true);
        console.log("Mode sélection activé !");
    };

    // --- Activate brush mode
    function setBrush() {
        canvas.isDrawingMode = true;
        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = brushColor;
        canvas.freeDrawingBrush.width = brushSize;
        console.log("Pinceau activé !");
    };

    // --- Activate Eraser
    function setEraser() {
        canvas.isDrawingMode = true;
        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = "#fff"; // Eraser = white background
        canvas.freeDrawingBrush.width = eraserSize;
        console.log("Gomme activée !");
    };

    // --- Add Rectangle
    function addRectangle() {
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

    // --- Add Circle
    function addCircle() {
        let circle = new fabric.Circle({
            left: 150,
            top: 150,
            radius: 40,
            fill: "red"
        });
        canvas.add(circle);
        saveState();
    };

    // --- Add Triangle
    function addTriangle() {
        let triangle = new fabric.Triangle({
            left: 200,
            top: 200,
            radius: 40,
            fill: "yellow"
        });
        canvas.add(triangle);
        saveState();
    };

    // --- Add Text
    function addText() {
        let text = new fabric.Text(
            textValue, 
            {fill: textColor}
        );
        canvas.add(text);
        saveState();
    };

    // --- Add Image
    function addImage() {
        if (!imageFile) {
            alert("No image file selected");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            const imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function() {
                const img = new fabric.Image(imgObj, {
                    left: 100,
                    top: 100,
                    angle: 0,
                    opacity: 1,
                    
                });
                img.scaleToWidth(400);
                canvas.add(img);
                saveState();
            }
        }
        reader.readAsDataURL(imageFile);
    };

    // --- Clear all
    function clearCanvas() {
        canvas.clear();
        canvas.backgroundColor = "#fff";
        saveState();
        canvas.renderAll();
    };

    // --- Undo and redo buttons
    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('redo').addEventListener('click', redo);

    // --- Tools buttons 
    document.getElementById("rectangleButton").addEventListener("click", addRectangle);
    document.getElementById("circleButton").addEventListener("click", addCircle);
    document.getElementById("triangleButton").addEventListener("click", addTriangle);
    document.getElementById("clearCanvasButton").addEventListener("click", clearCanvas);
    document.getElementById("imageButton").addEventListener("click", addImage);
    // document.getElementById("lineButton").addEventListener("click", setLine);

    // --- Tools inputs settings

    // color peakers
    document.getElementById("backgroundColorPicker").addEventListener("input", function (event) {
        let newColor = event.target.value;
        canvas.backgroundColor = newColor;
        canvas.renderAll();
        saveState();
    });

    document.getElementById("brushColorPicker").addEventListener("input", function(event){
        brushColor = event.target.value;
        activateMode("brush");
        canvas.renderAll();
    });

    document.getElementById("textColorPicker").addEventListener("input", function(event){
        textColor = event.target.value;
    });
    
    // range sliders
    document.getElementById("brushSizeSlider").addEventListener("input", function(event){
        brushSize = Number(event.target.value);
        activateMode("brush");
        canvas.renderAll();
    });

    document.getElementById("eraserSlider").addEventListener("input", function(event){
        eraserSize = Number(event.target.value);
        activateMode("eraser");
        canvas.renderAll();
    });

    document.getElementById("textButton").addEventListener("click", function(){
        textValue = document.getElementById("textInput").value;
        addText();
        canvas.renderAll();
    });

    document.getElementById("imageInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;
        imageFile = file;
    });

    // --- Buttons select and activation system

    const buttons = document.querySelectorAll('.tool-btn');

    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    function activateMode(mode) {
        const selectButton = document.getElementById('selectButton');
        const brushButton = document.getElementById('brushButton');
        const eraserButton = document.getElementById('eraserButton');
        
        selectButton.classList.remove('disabled-btn');
        selectButton.disabled = false;
        brushButton.classList.remove('disabled-btn');
        brushButton.disabled = false;
        eraserButton.classList.remove('disabled-btn');
        eraserButton.disabled = false;
        
        if (mode === 'brush') {
            brushButton.classList.add('disabled-btn');
            brushButton.disabled = true;
            setBrush();
        } else if (mode === 'eraser') {
            eraserButton.classList.add('disabled-btn');
            eraserButton.disabled = true;
            setEraser();
        }
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
                activateMode("brush");
                break;
            default:
                break;
        } 
    }

    // --- Saving canvas state after each modification

    canvas.on("object:modified", saveState);
    canvas.on("path:created", saveState);
    // canvas.on("object:added", saveState);
    // canvas.on("object:removed", saveState);
});
