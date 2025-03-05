import { saveState } from './historicManager.js';
import { setupEventListeners } from './eventListeners.js';
import { setupShortcuts } from './shortcuts.js';
import { setupBrushMode } from './brush.js';
import { setupSockets } from './socketManager.js';

document.addEventListener("DOMContentLoaded", function () {

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
  canvas.backgroundColor = 'black';
  canvas.renderAll();
  const cursorCanvas = document.getElementById("cursorCanvas");

  
  const ctx = cursorCanvas.getContext("2d");
  cursorCanvas.width = canvas.width;
  cursorCanvas.height = canvas.height;

  setupEventListeners(canvas);
  setupShortcuts(canvas);
  setupBrushMode(canvas)

  // Save the initial state
  saveState(canvas);
  setupSockets(canvas, cursorCanvas);



  // Delete
  let deleteButton = document.getElementById("deleteButton");

  canvas.on('selection:created', () => {
      deleteButton.classList.remove('disabled-btn');
      deleteButton.disabled = false;
  });
  canvas.on('selection:cleared', () => {
      deleteButton.classList.add('disabled-btn');
      deleteButton.disabled = true;
  });

  // --- Saving canvas state after each modification

  canvas.on("object:modified", () => { 
    saveState(canvas);
  });
  canvas.on("path:created", () => { 
    saveState(canvas);
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
