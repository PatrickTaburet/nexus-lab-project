import { zoomCanvas, resizeCanvas, clearCanvas, downloadCanvas, saveCanvasAsJSON, deleteSelectedObjects } from './tools.js';
import { addRectangle, addCircle, addTriangle, addLine, addText, addImage,  } from './drawing.js';
import { handleButtonClick } from './brush.js';
import { saveState, undo, redo } from './historicManager.js';

let imageFile;
let textColor = "#00fff7";
let backgroundColor = "black";

export function setupEventListeners(canvas) { 

    // Zoom
    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey) { 
            if (event.key === "+") {
                zoomCanvas(canvas, 1.1); 
                event.preventDefault(); 
            } else if (event.key === "-") {
                zoomCanvas(canvas, 0.9); 
                event.preventDefault();
            }
        }
    });

    // Canvas

    window.addEventListener("resize", ()=> {resizeCanvas(canvas)});

    //Save canvas
    document.getElementById("saveImageButton").addEventListener("click", function() {
        saveCanvasAsJSON(canvas);
        // downloadCanvas(canvas, "png");
    });


    // --- Undo and redo buttons
    document.getElementById('undo').addEventListener('click', function() {undo(canvas)});
    document.getElementById('redo').addEventListener('click', function() {redo(canvas)});

    // --- Zoom buttons

    document.getElementById("zoomOutButton").addEventListener("click",  () => {zoomCanvas(canvas, 0.9)})
    document.getElementById("zoomInButton").addEventListener("click", () => { zoomCanvas(canvas, 1.1)})

    // --- Tools buttons 
    document.getElementById("rectangleButton").addEventListener("click", () => {addRectangle(canvas)});
    document.getElementById("circleButton").addEventListener("click", () => {addCircle(canvas)});
    document.getElementById("triangleButton").addEventListener("click", () => {addTriangle(canvas)});
    document.getElementById("clearCanvasButton").addEventListener("click", ()=> {clearCanvas(canvas, backgroundColor)});
    document.getElementById("imageButton").addEventListener("click", () => {addImage(canvas, imageFile)});
    document.getElementById("lineButton").addEventListener("click", () => {addLine(canvas)});
    document.getElementById("textButton").addEventListener("click", function(){
        let textValue = document.getElementById("textInput").value;
        addText(canvas, textColor, textValue);
        canvas.renderAll();
    });
    document.getElementById("deleteButton").addEventListener("click", ()=> {deleteSelectedObjects(canvas)}); 

    // --- Select and activation system buttons

    document.querySelectorAll('.tool-btn').forEach(button => {
        button.addEventListener('click', (event) => {handleButtonClick(event, canvas)});
    });

    
    // --- Tools inputs settings

    // Background alpha

    document.getElementById("alphaCheckbox").addEventListener("change", function() {
        if (this.checked){
            canvas.backgroundColor = null;
        } else {
            canvas.backgroundColor = backgroundColor;
        }
        canvas.renderAll();
    });

    // background

    document.getElementById("backgroundColorPicker").addEventListener("input", function (event) {
        backgroundColor= event.target.value;
        canvas.backgroundColor = backgroundColor;
        canvas.renderAll();
        saveState(canvas);
    });


    // image

    document.getElementById("imageInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;
        imageFile = file;
    });

    // text

    document.getElementById("textColorPicker").addEventListener("input", function(event){
        textColor = event.target.value;
    });


}
