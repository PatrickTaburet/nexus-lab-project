let eraserGroup = new fabric.Group([], {
    selectable: false,
    evented: false 
});

let eraserSize = 10;
let isErasing = false;

canvas.add(eraserGroup);

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
        isErasing = true;
        canvas.isDrawingMode = true;
    
        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = backgroundColor;
        canvas.freeDrawingBrush.width = eraserSize;
        canvas.freeDrawingBrush.strokeDashArray = null; 
        canvas.freeDrawingBrush.shadow = null;
    }
    
    
    canvas.on('path:created', function (event) {
        let path = event.path;
    
        if (isErasing) {
            canvas.remove(path);
            path.selectable = false;
            path.evented = false;
            eraserGroup.add(path);
            canvas.add(eraserGroup); 
            // eraserGroup.selectable = false; 
            canvas.requestRenderAll();
        }
    });

    document.getElementById("backgroundColorPicker").addEventListener("input", function (event) {
        backgroundColor= event.target.value;
        canvas.backgroundColor = backgroundColor;
        updateEraserColor(backgroundColor);
        if(document.getElementById("eraserButton").classList.contains("disabled-btn")){
            setEraser();
        }
        canvas.renderAll();
        saveState();
    });

    function updateEraserColor(newColor) {
        eraserGroup.getObjects().forEach(obj => {
            obj.set({ stroke: newColor }); 
        });
        canvas.requestRenderAll(); 
    }

        // eraser

        document.getElementById("eraserSlider").addEventListener("input", function(event){
            eraserSize = Number(event.target.value);
            activateMode("eraser");
            canvas.renderAll();
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