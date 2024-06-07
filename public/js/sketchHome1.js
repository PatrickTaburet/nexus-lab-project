let prevX, prevY;

function setup(){
    const canvas = createCanvas(windowWidth, windowHeight*2);
    canvas.parent('sketch1');
    canvas.id('myCanvas');
    colorMode(HSL, 360, 100, 100, 1);
    frameRate(60);
    background(217, 54, 11);
    // noStroke(); 
    prevX = mouseX;
    prevY = mouseY;
    strokeWeight(3);
}

function draw(){
    let h = random(0, 360); 
    let s = 100;           
    let l = 50;             
    let alpha = 0.6;        
    let col = color(h, s, l, alpha);
    stroke(col);

    let stepSize = random(10, 30);
    let direction = floor(random(4));

    let newX = prevX;
    let newY = prevY;

    if (direction == 0) {
        newX += stepSize;  // Droite
      } else if (direction == 1) {
        newX -= stepSize;  // Gauche
      } else if (direction == 2) {
        newY += stepSize;  // Bas
      } else if (direction == 3) {
        newY -= stepSize;  // Haut
      }
    
    line(prevX, prevY, newX, newY);

    prevX = newX;
    prevY = newY;

    fill(0, 0, 0, 0.05); // Couche translucide noire pour créer un effet de fondu
    noStroke();
    rect(0, 0, width, height);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight*2);
    background(217, 54, 11);
    prevX = mouseX;
    prevY = mouseY;
  }
function mouseMoved() {
// Repositionner la ligne de départ lorsque la souris se déplace
prevX = mouseX;
prevY = mouseY;
}
  
// /** @type {HTMLCanvasElement} */  
// // -> add intellisense for ctx functions

// let canvas = document.querySelector('#canvas1');
// let ctx = canvas.getContext('2d');
// let drawing = false;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// class Root{

//     constructor(x, y){
//         this.x = x;
//         this.y = y;
//         this.speedX = Math.random() * 4 - 2;  // Math.random() * (max - min) + min  --> between -2 & 2
//         this.speedY = Math.random() * 4 - 2;
//         this.maxSize = Math.random() * 7 + 5;
//         this.size = Math.random() * 1 + 2;
//         this.velocitySize = Math.random() * 0.2 + 0.05;
//         this.angleX = Math.random() * 6.2; // 6.2 radians -> 360°
//         this.velocityAngleX  = Math.random() * 0.6  - 0.3;
//         this.angleY = Math.random() * 6.2; 
//         this.velocityAngleY  = Math.random() * 0.6  - 0.3;
//         this.lightness = 10;
//     }
//     update(){
//         this.x += this.speedX + Math.sin(this.angleX);
//         this.y += this.speedY + Math.sin(this.angleY);
//         this.size += this.velocitySize;
//         this.angleX += this.velocityAngleX ;
//         this.angleY += this.velocityAngleY ;
//         if (this.lightness < 70) this.lightness += 0.4; // increase the lightness for a "3D" render (from 10% dark to 70% light)
//         if(this.size <= this.maxSize){
//             ctx.beginPath();
//             ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//             ctx.fillStyle = "hsl(140,100%," + this.lightness + "%)";
//             ctx.fill();
//             ctx.stroke();
//             requestAnimationFrame(this.update.bind(this));
//         }
        
        
//     }
// }
// window.addEventListener("mousemove", (e) =>{
//     if (drawing){
//         for (let i=0 ; i < 2; i++){
//             let root = new Root(e.x, e.y);
//             root.update();
//         }
//     }
// });
// window.addEventListener("mousedown", function(){
//     drawing = true;
// });
// window.addEventListener("mouseup", function(){
//     drawing = false;
// });
