import { saveState } from './historicManager.js';

// Shapes color
let shapesColor = "#00fff7";
document.getElementById("shapesColorPicker").addEventListener("input", function (event) {
    shapesColor = event.target.value;
});
let shapeX = window.innerWidth * 0.1;
let shapeY = window.innerWidth * 0.1;
let globalOffset = window.innerWidth * 0.1;
let shapesOffset = {
    rectangle: 10,
    circle: 10,
    triangle: 10,
    line: 10
}
const INDIVIDUAL_OFFSET = 15;

// --- Activate select mode
export function setSelectionMode(canvas) {
    canvas.isDrawingMode = false;
    canvas.selection = true;
};

// --- Add Rectangle
export function addRectangle(canvas) {
    let rect = new fabric.Rect({
        left: shapeX + shapesOffset.rectangle,
        top: shapeY + shapesOffset.rectangle,
        fill: shapesColor,
        width: 80,
        height: 60
    });
    shapesOffset.rectangle += INDIVIDUAL_OFFSET;
    canvas.add(rect);
    saveState(canvas);
};

// --- Add Circle
export function addCircle(canvas) {
    let circle = new fabric.Circle({
        left: shapeX + globalOffset + shapesOffset.circle,
        top: shapeY + shapesOffset.circle,
        radius: 40,
        fill: shapesColor
    });
    shapesOffset.circle += INDIVIDUAL_OFFSET;
    canvas.add(circle);
    saveState(canvas);
};

// --- Add Triangle
export function addTriangle(canvas) {
    let triangle = new fabric.Triangle({
        left: shapeX + (globalOffset * 2 )+ shapesOffset.triangle,
        top: shapeY + shapesOffset.triangle,
        radius: 40,
        fill: shapesColor
    });
    shapesOffset.triangle += INDIVIDUAL_OFFSET;
    canvas.add(triangle);
    saveState(canvas);
};

// --- Add Line
export function addLine(canvas) {
    let line = new fabric.Line(
        [
            shapeX * 2 + shapesOffset.line, 
            shapeY * 2 + shapesOffset.line, 
            shapeX + shapesOffset.line,
            shapeY * 2  + shapesOffset.line
        ],
        {
            stroke: shapesColor,
            strokeWidth: 3
        }
    );
    shapesOffset.line += INDIVIDUAL_OFFSET;
    canvas.add(line);
    saveState(canvas);
};

// --- Add Text
export function addText(canvas, textColor, textValue) {
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
        saveState(canvas);
    }
};


// --- Add Image
export function addImage(canvas, imageFile) {
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
            saveState(canvas);
        }
    }
    reader.readAsDataURL(imageFile);
};
