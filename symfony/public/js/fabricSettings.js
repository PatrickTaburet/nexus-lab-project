document.addEventListener("DOMContentLoaded", function () {
    let undoStack = [];
    let redoStack = [];
    let brushColor = "black";
    let textColor = "black";
    let brushSize = 5;
    let eraserSize = 10;
    let textValue, imageFile, clipboard;
    let shapesColor = "blue"
    let backgroundColor = 'white'
    let brushStyle = "solid";
    // let isMirror = false;
    // let mirrorPath = null;
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
    canvas.backgroundColor = backgroundColor;
    canvas.renderAll();

    function saveState() {
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

    function undo() {
        if (undoStack.length > 1) {
            redoStack.push(undoStack.pop());
            if (redoStack.length > MAX_HISTORY_SIZE) {
                redoStack.shift();
            }
            loadState(undoStack[undoStack.length - 1]);
        }
        updateButtons();
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

    // --- Copy / Paste systemm

    async function copy() {
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

    async function paste() {
        if (!clipboard) return;
        console.log('Original clipboard:', clipboard);
    
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
    
            console.log('Pasted object:', clonedObj);
        } catch (error) {
            console.error("Error during pasting:", error);
        }
    }
    

    // --- Save the initial state
    saveState();

    // --- Activate select mode
    function setSelectionMode() {
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.forEachObject(obj => obj.selectable = true);
    };

    // --- Activate brush mode
    function setBrush() {
        canvas.isDrawingMode = true;
        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = brushColor;
        canvas.freeDrawingBrush.width = brushSize;

        const spacingFactor = 2;

        canvas.freeDrawingBrush.strokeDashArray = null;
        canvas.freeDrawingBrush.shadow = null;

        if (brushStyle === "solid") {
            canvas.freeDrawingBrush.strokeDashArray = null;
        } else if (brushStyle === "dotted") {
            canvas.freeDrawingBrush.strokeDashArray = [1, brushSize * spacingFactor]; 
        } else if (brushStyle === "dashed") {
            canvas.freeDrawingBrush.strokeDashArray = [brushSize * 4, brushSize * spacingFactor]; 
        } else if (brushStyle === "glow") {
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                color: 'rgba(0, 255, 255, 0.9)',
                blur: 15
            });
        }
    };

    // --- Activate Eraser
    // function setEraser() {
    //     canvas.isDrawingMode = true;
    //     if (!canvas.freeDrawingBrush) {
    //         canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    //     }
    //     canvas.freeDrawingBrush.color = "#fff"; // Eraser = white background
    //     canvas.freeDrawingBrush.width = eraserSize;
    // };
    function setEraser() {
        canvas.isDrawingMode = true;
        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = backgroundColor; 
        canvas.freeDrawingBrush.width = eraserSize;
    };

    // --- Add Rectangle
    function addRectangle() {
        let rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: shapesColor,
            width: 80,
            height: 60
        });
        canvas.add(rect);
        saveState();

    };

    // --- Add Circle
    function addCircle() {
        let circle = new fabric.Circle({
            left: 250,
            top: 100,
            radius: 40,
            fill: shapesColor
        });
        canvas.add(circle);
        saveState();
    };

    // --- Add Triangle
    function addTriangle() {
        let triangle = new fabric.Triangle({
            left: 400,
            top: 100,
            radius: 40,
            fill: shapesColor
        });
        canvas.add(triangle);
        saveState();
    };

    // --- Add Triangle
    function addLine() {
        let line = new fabric.Line([750,150,550,150],{
            stroke: shapesColor,
            strokeWidth: 3
        });
        canvas.add(line);
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

    // Background alpha

    document.getElementById("alphaCheckbox").addEventListener("change", function() {
        if (this.checked){
            canvas.backgroundColor = null;
        } else {
            canvas.backgroundColor = backgroundColor;
        }
        canvas.renderAll();
    });

    // --- Clear all
    function clearCanvas() {
        canvas.clear();
        canvas.backgroundColor = backgroundColor;
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
    document.getElementById("lineButton").addEventListener("click", addLine);

    // --- Tools inputs settings

    // Shapes

    document.getElementById("shapesColorPicker").addEventListener("input", function (event) {
        shapesColor = event.target.value;
    });

    // background

    document.getElementById("backgroundColorPicker").addEventListener("input", function (event) {
        backgroundColor= event.target.value;
        canvas.backgroundColor = backgroundColor;
        if(document.getElementById("eraserButton").classList.contains("disabled-btn")){
            setEraser();
        }
        canvas.renderAll();
        saveState();
    });

    // brush

    document.getElementById("brushColorPicker").addEventListener("input", function(event){
        brushColor = event.target.value;
        activateMode("brush");
        canvas.renderAll();
    });

    document.getElementById("brushSizeSlider").addEventListener("input", function(event){
        brushSize = Number(event.target.value);
        activateMode("brush");
        canvas.renderAll();
    });

    document.getElementById("brushStyle").addEventListener("change", function () {
        brushStyle = this.value;
        activateMode("brush");
        canvas.renderAll();
    });
    
    // eraser

    document.getElementById("eraserSlider").addEventListener("input", function(event){
        eraserSize = Number(event.target.value);
        activateMode("eraser");
        canvas.renderAll();
    });
    
    // text

    document.getElementById("textColorPicker").addEventListener("input", function(event){
        textColor = event.target.value;
    });

    document.getElementById("textButton").addEventListener("click", function(){
        textValue = document.getElementById("textInput").value;
        addText();
        canvas.renderAll();
    });

    // image

    document.getElementById("imageInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;
        imageFile = file;
    });

    
    // mirror mode
    document.getElementById("mirrorMode").addEventListener("change", function () {
        isMirror = this.checked;
        this.checked && activateMode("brush");
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

    // --- Keyboard shortcuts

    document.addEventListener("keydown", function (event) {    
        if (event.ctrlKey && event.key === "z") {
            event.preventDefault();
            undo();
        } else if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "z") { 
            event.preventDefault();
            redo();
        } else if (event.ctrlKey && event.key === "y") {
            event.preventDefault();
            redo();
        }
    });

    document.addEventListener("keydown", function (event) {    
        if (event.ctrlKey && event.key === "c") {
            event.preventDefault();
            copy();
        } else if (event.ctrlKey && event.key === "v") {
            event.preventDefault();
            paste();
        }
    });



    // --- Saving canvas state after each modification

    canvas.on("object:modified", saveState);
    canvas.on("path:created", saveState);
    // canvas.on("object:added", saveState);
    // canvas.on("object:removed", saveState);

    // --- Save canvas

    function downloadCanvas(format = 'png') {
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
    

    document.getElementById("saveImageButton").addEventListener("click", function() {
        downloadCanvas("png");
    });
});
