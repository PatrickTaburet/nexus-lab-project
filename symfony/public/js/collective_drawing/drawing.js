import { saveState } from './utils.js';

// --- Activate select mode
export function setSelectionMode(canvas) {
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.forEachObject(obj => obj.selectable = true);
};

// --- Add Rectangle
export function addRectangle(canvas, shapesColor) {
    let rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: shapesColor,
        width: 80,
        height: 60
    });
    canvas.add(rect);
    saveState(canvas);

};

// --- Add Circle
export function addCircle(canvas, shapesColor) {
    let circle = new fabric.Circle({
        left: 250,
        top: 100,
        radius: 40,
        fill: shapesColor
    });
    canvas.add(circle);
    saveState(canvas);
};

// --- Add Triangle
export function addTriangle(canvas, shapesColor) {
    let triangle = new fabric.Triangle({
        left: 400,
        top: 100,
        radius: 40,
        fill: shapesColor
    });
    canvas.add(triangle);
    saveState(canvas);
};

// --- Add Triangle
export function addLine(canvas, shapesColor) {
    let line = new fabric.Line([750,150,550,150],{
        stroke: shapesColor,
        strokeWidth: 3
    });
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
