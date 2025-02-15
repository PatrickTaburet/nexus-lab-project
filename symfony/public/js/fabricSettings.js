document.addEventListener("DOMContentLoaded", function () {
    // Vérifie que Fabric.js est bien chargé
    if (typeof fabric === "undefined") {
        console.error("Fabric.js n'est pas chargé !");
        return;
    }

    // Initialisation du canvas
    const canvas = new fabric.Canvas("drawingCanvas", {
        width: 800,
        height: 500,
        isDrawingMode: false // Désactivé au départ
    });

    // Définir le fond noir correctement
    canvas.backgroundColor = "#000";  // Utiliser backgroundColor directement
    canvas.renderAll();               // Appliquer le fond noir

    // Historique pour Undo/Redo
    let undoStack = [];
    let redoStack = [];

    function saveState() {
        redoStack = [];
        undoStack.push(JSON.stringify(canvas));
    }

    // Activation du pinceau
    window.setBrush = function () {
        canvas.isDrawingMode = true;
        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = "black";
        canvas.freeDrawingBrush.width = 5;
        console.log("Pinceau activé !");
    };

    // Activation de la gomme
    window.setEraser = function () {
        canvas.isDrawingMode = true;
        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = "#000"; // Gomme = fond noir
        canvas.freeDrawingBrush.width = 10;
        console.log("Gomme activée !");
    };

    // Ajouter un rectangle
    window.addRectangle = function () {
        saveState();
        let rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: "blue",
            width: 80,
            height: 60
        });
        canvas.add(rect);
    };

    // Ajouter un cercle
    window.addCircle = function () {
        saveState();
        let circle = new fabric.Circle({
            left: 150,
            top: 150,
            radius: 40,
            fill: "red"
        });
        canvas.add(circle);
    };

    // Undo (annuler dernière action)
    window.undo = function () {
        if (undoStack.length > 0) {
            redoStack.push(JSON.stringify(canvas));
            canvas.loadFromJSON(undoStack.pop(), () => canvas.renderAll());
        }
    };

    // Redo (refaire action annulée)
    window.redo = function () {
        if (redoStack.length > 0) {
            undoStack.push(JSON.stringify(canvas));
            canvas.loadFromJSON(redoStack.pop(), () => canvas.renderAll());
        }
    };

    // Effacer tout
    window.clearCanvas = function () {
        saveState();
        canvas.clear();
        canvas.backgroundColor = "#000"; // Réinitialiser le fond noir
        canvas.renderAll();
    };

    // Sauvegarde de l'état du canvas à chaque modification
    canvas.on("object:added", saveState);
    canvas.on("object:modified", saveState);
    canvas.on("object:removed", saveState);
});
