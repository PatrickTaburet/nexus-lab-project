import { saveState } from './historicManager.js';
import { setupEventListeners } from './eventListeners.js';
import { setupShortcuts } from './shortcuts.js';
import { setupBrushMode } from './brush.js';
import { setupSockets } from './socketManager.js'; // Import du module socket

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
  setupEventListeners(canvas);
  setupShortcuts(canvas);
  setupBrushMode(canvas)

  // Save the initial state
  saveState(canvas);
  setupSockets(canvas);



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
  // canvas.on("object:added", () => { 
  //   const data = canvas.toJSON();
  //   socket.emit("draw", { sessionId, data });
  // });
  // canvas.on("object:removed", () => { 
  //   const data = canvas.toJSON();
  //   socket.emit("draw", { sessionId, data });
  // });

  // Sockets.io

  // const socket = io("http://localhost:3001"); // Connecte au serveur WebSocket
  // const sessionId = "session1"; // ID unique pour la session (peut être dynamique)

  // Rejoindre une session
  // socket.emit("join_session", sessionId);

  // Charger un dessin existant (s'il y en a un)
  // socket.on("load_canvas", (data) => {
  //     canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
  // });

  // Détecter les modifications sur le canvas et les envoyer au serveur
  // canvas.on("object:modified", function () {
  //     const data = canvas.toJSON();
  //     socket.emit("draw", { sessionId, data });
  // });

  // Recevoir les mises à jour en temps réel et les appliquer
//   socket.on("draw", (data) => {
//     canvas.clear(); // Supprime tous les objets avant de recharger
//     canvas.loadFromJSON(data, function() {
//         canvas.renderAll();
//         canvas.calcOffset();
//         canvas.requestRenderAll(); // Force le rendu total
//     });
// });



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
