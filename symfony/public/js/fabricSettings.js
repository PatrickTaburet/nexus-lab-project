document.addEventListener("DOMContentLoaded", function () {

    let undoStack = [];
    let redoStack = [];
    let brushColor = "white";
    let textColor = "#00fff7";
    let brushSize = 5;
    let textValue, imageFile, clipboard;
    let shapesColor = "#00fff7"
    let backgroundColor = 'black'
    let brushStyle = "solid";
    const MAX_HISTORY_SIZE = 10;
    let undoButton = document.getElementById('undo');
    let redoButton = document.getElementById('redo');

    if (typeof fabric === "undefined") {
        console.error("Fabric.js is not loaded!");
        return;
    }
        
    // --- Canvas init

    const canvas = new fabric.Canvas("drawingCanvas", {
        width: window.innerWidth / 2,
        height: window.innerHeight / 1.7,
        isDrawingMode: false
    });
    canvas.backgroundColor = backgroundColor;
    canvas.renderAll();

    function resizeCanvas() {
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


    window.addEventListener("resize", resizeCanvas);

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
        undoButton.disabled = (undoStack.length <= 1);
        redoButton.disabled = (redoStack.length === 0);
        undoButton.classList.toggle("disabled-btn", undoButton.disabled);
        redoButton.classList.toggle("disabled-btn", redoButton.disabled);
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
    
    // Zoom in / out
        
    function zoomCanvas(factor) {
        let zoom = canvas.getZoom();
        let newZoom = zoom * factor;
    
        if (newZoom > 5) newZoom = 5;
        if (newZoom < 0.5) newZoom = 0.5;
    
        canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, newZoom);
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
                blur: 15 * (brushSize /10),
            });
        }
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
            {
                top : 300,
                left : 300,
                fill: textColor
            }
        );  
        if (textValue){ 
            canvas.add(text);
            saveState();
        }
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

    undoButton.addEventListener('click', undo);
    redoButton.addEventListener('click', redo);

    // --- Zoom buttons

    document.getElementById("zoomOutButton").addEventListener("click",  () => {zoomCanvas(0.9)})
    document.getElementById("zoomInButton").addEventListener("click", () => { zoomCanvas(1.1)})

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
        canvas.renderAll();
        saveState();
    });
    

    // brush

    document.getElementById("brushColorPicker").addEventListener("input", function(event){
        brushColor = event.target.value;
        handleBrushMode();
        canvas.renderAll();
    });

    document.getElementById("brushSizeSlider").addEventListener("input", function(event){
        brushSize = Number(event.target.value);
        handleBrushMode();
        canvas.renderAll();
    });

    document.getElementById("brushStyle").addEventListener("change", function () {
        brushStyle = this.value;
        handleBrushMode();
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

    
    // --- Buttons select and activation system

    const buttons = document.querySelectorAll('.tool-btn');

    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    function handleBrushMode() {
        const selectButton = document.getElementById('selectButton');
        const brushButton = document.getElementById('brushButton');
        
        selectButton.classList.remove('disabled-btn');
        selectButton.disabled = false;
        brushButton.classList.add('disabled-btn');
        brushButton.disabled = true;
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
            case 'brushButton':
                handleBrushMode();
                break;
            default:
                break;
        } 
    }

    // --- Keyboard shortcuts

    // Undo / Redo
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

    // Copy / Paste
    document.addEventListener("keydown", function (event) {    
        if (event.ctrlKey && event.key === "c") {
            event.preventDefault();
            copy();
        } else if (event.ctrlKey && event.key === "v") {
            event.preventDefault();
            paste();
        }
    });

    // Delete
    let deleteButton = document.getElementById("deleteButton");
    deleteButton.addEventListener("click", deleteSelectedObjects); 

    document.addEventListener("keydown", function(event){
        if (event.key === "Delete"){
            deleteSelectedObjects();
        }
    })

    function deleteSelectedObjects(){
        let activeObjects = canvas.getActiveObjects();

        if (activeObjects.length) {            
            activeObjects.forEach(obj => {
                canvas.remove(obj);
            });
            canvas.discardActiveObject();
            canvas.requestRenderAll(); 
        }
    }

    canvas.on('selection:created', () => {
        deleteButton.classList.remove('disabled-btn');
        deleteButton.disabled = false;
    });
    canvas.on('selection:cleared', () => {
        deleteButton.classList.add('disabled-btn');
        deleteButton.disabled = true;
    });

    // Zoom

    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey) { 
            if (event.key === "+") {
                zoomCanvas(1.1); 
                event.preventDefault(); 
            } else if (event.key === "-") {
                zoomCanvas(0.9); 
                event.preventDefault();
            }
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


  
  // --------- Sliders animation ---------
    
  const allRanges = document.querySelectorAll(".range-wrap");
  allRanges.forEach((wrap) => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");

    range.addEventListener("input", () => {
      setBubble(range, bubble);
    });

    // setting bubble on DOM load
    setBubble(range, bubble);
  });

  function setBubble(range, bubble) {
    const val = range.value;

    const min = range.min || 0.001;
    const max =  range.max || 0.1;

    const offset = Number(((val - min) * 100) / (max - min));

    bubble.textContent = val;

    // yes, 14px is a magic number
    bubble.style.left = `calc(${offset}% - 14px)`;
  }

