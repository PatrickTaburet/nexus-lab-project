import { copy, paste, deleteSelectedObjects } from './tools.js';
import { undo, redo } from './historicManager.js';


export function setupShortcuts(canvas) { 

    // --- Keyboard shortcuts

    // Undo / Redo
    document.addEventListener("keydown", function (event) {    
        if (event.ctrlKey && event.key === "z") {
            event.preventDefault();
            undo(canvas);
        } else if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "z") { 
            event.preventDefault();
            redo(canvas);
        } else if (event.ctrlKey && event.key === "y") {
            event.preventDefault();
            redo(canvas);
        }
    });

    // Copy / Paste
    document.addEventListener("keydown", function (event) {    
        if (event.ctrlKey && event.key === "c") {
            event.preventDefault();
            copy(canvas);
        } else if (event.ctrlKey && event.key === "v") {
            event.preventDefault();
            paste(canvas);
        }
    });

    // Delete
    document.addEventListener("keydown", function(event){
        if (event.key === "Delete"){
            deleteSelectedObjects(canvas);
        }
    })
}