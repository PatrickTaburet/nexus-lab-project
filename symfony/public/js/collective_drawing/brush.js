import { setSelectionMode } from './drawing.js';

let brushColor = "white";
let brushSize = 5;
let brushStyle = "solid";
    
// Initialisation
export function setupBrushMode(canvas){
    document.getElementById("brushColorPicker").addEventListener("input", function(event){
        brushColor = event.target.value;
        handleBrushMode(canvas);
        canvas.renderAll();
    });
    
    document.getElementById("brushSizeSlider").addEventListener("input", function(event){
        brushSize = Number(event.target.value);
        handleBrushMode(canvas);
        canvas.renderAll();
    });
    
    document.getElementById("brushStyle").addEventListener("change", function () {
        brushStyle = this.value;
        handleBrushMode(canvas);
        canvas.renderAll();
    });
}


// --- Activate brush mode

export function setBrush(canvas) {
    canvas.isDrawingMode = true;
    if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushSize;

    const spacingFactor = 2;

    canvas.freeDrawingBrush.strokeDashArray = null;
    canvas.freeDrawingBrush.shadow = null;

    switch (brushStyle) {
        case "solid":
            canvas.freeDrawingBrush.strokeDashArray = null;
            break;
        case "dotted":
            canvas.freeDrawingBrush.strokeDashArray = [1, brushSize * spacingFactor]; 
            break;
        case "dashed":
            canvas.freeDrawingBrush.strokeDashArray = [brushSize * 4, brushSize * spacingFactor]; 
            break;
        case "glow":
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                color: 'rgba(0, 255, 255, 0.9)',
                blur: 15 * (brushSize /10),
            });
            break;
        default:
            break;
    }
};

export function handleBrushMode(canvas) {
    const selectButton = document.getElementById('selectButton');
    const brushButton = document.getElementById('brushButton');
    
    selectButton.classList.remove('disabled-btn');
    selectButton.disabled = false;
    brushButton.classList.add('disabled-btn');
    brushButton.disabled = true;
    setBrush(canvas);
}

export function handleButtonClick(event, canvas) {
    document.querySelectorAll('.tool-btn').forEach(button => {
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
            setSelectionMode(canvas);
            break;
        case 'brushButton':
            handleBrushMode(canvas);
            break;
        default:
            break;
    } 
}
