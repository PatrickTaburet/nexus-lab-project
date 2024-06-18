
// --------------------- Recreating the Noise Orbit (Stevan Dedovic) --------------------------

// Variables

const numSteps = 10;
let colorSlider ;
let colorRangeSlider;
let brightnessSlider;
let moveSlider;
let deformSlider;
let deformSlider2;
let shapeSlider;
let ringsSlider;
let zoomSlider;
let diameterSlider;

// Setup 

function setup() {
    const squareSize = min(windowWidth-30, windowHeight-30);
    const canvas = createCanvas(squareSize, squareSize);
    canvas.parent('sketch');
    canvas.id('myCanvas');
    background(0, 0, 0);
    colorMode(HSB, 360, 100, 100, 1.0);

 // User Interface :

    colorSlider = select(".colorSlider");
    colorRangeSlider = select(".colorRangeSlider");
    brightnessSlider = select(".brightnessSlider");
    moveSlider = select(".moveSlider");
    deformSlider = select(".deformSlider");
    deformSlider2 = select(".deformSlider2");
    shapeSlider = select(".shapeSlider");
    ringsSlider = select(".ringsSlider");
    zoomSlider = select(".zoomSlider");
    diameterSlider = select(".diameterSlider");

    resetButton.mousePressed(() => {
        reset(); // Reset the canvas to its initial state
    });
}

function draw() {

    noFill(); 
    strokeWeight(w(0.001));
    // console.log(colorSlider.value());
    // console.log("2 -" + colorRangeSlider.value());

    for (let radius = 0.05; radius < diameterSlider.value(); radius += ringsSlider.value()+0.005) {
        stroke(colorSlider.value()+radius*colorRangeSlider.value(), brightnessSlider.value(), 100); 
        let circle = makeCircle(numSteps, radius*zoomSlider.value());
        let distortedCircle = distortPolygon(circle);
        let smoothCircle = chaikin(distortedCircle, 4); // To make circle from a polygon (angle -> curve)

        beginShape();
        smoothCircle.forEach(point => {
            vertex(w(point[0]), h(point[1]));
        });
        endShape(CLOSE); // CLOSE because the last point is not the first point
    }
}

function distortPolygon(polygon) {
  const z = frameCount / 500;
  const z2 = frameCount / 100;

  return polygon.map(point => {
    const x = point[0];
    const y = point[1];
    const distance = dist(deformSlider.value(),deformSlider2.value(), x, y);
    
    const noiseFn = (x, y) => {
      const noiseX = (x + 0.31) * distance * 2 + z2;
      const noiseY = (y - 1.73) * distance * 2 + z2;
      return noise(noiseX, noiseY, z);
    };
    // console.log(frameCount);
    const theta = noiseFn(x, y) * Math.PI * 3;
    
    const amountToNudge = 0.08 - (Math.cos(z) * moveSlider.value());
    const newX = x + (amountToNudge * Math.cos(theta));
    const newY = y + (amountToNudge * Math.sin(theta));
    
    return [newX, newY];
  });
}


function makeCircle(numSides, radius) {
  const points = [];
  const radiansPerStep = (Math.PI * shapeSlider.value()) / numSides;
  for (let theta = 0; theta < Math.PI * 2; theta += radiansPerStep) {
    const x = 0.5 + radius * Math.cos(theta);
    const y = 0.5 + radius * Math.sin(theta);
    
    points.push([x, y]);
  }
  return points;
}

//Chaikin algorythm : find on https://observablehq.com/@pamacha/chaikins-algorithm

function chaikin(arr, num) {
  if (num === 0) return arr;
  const l = arr.length;
  const smooth = arr.map((c,i) => {
    return [[0.75*c[0] + 0.25*arr[(i + 1)%l][0],
             0.75*c[1] + 0.25*arr[(i + 1)%l][1]],
            [0.25*c[0] + 0.75*arr[(i + 1)%l][0],
            0.25*c[1] + 0.75*arr[(i + 1)%l][1]]];
    }).flat();
  return num === 1 ? smooth : chaikin(smooth, num - 1)
}

// to set pixel range of the width between 0 and 1

function w(val) {
  if (val == null) return width;
  return width * val;
}

function h(val) {
  if (val == null) return height;
  return height * val;
}

function windowResized() {
    const squareSize = min(windowWidth-30, windowHeight-30);
    const canvas = createCanvas(squareSize, squareSize);
    canvas.parent('sketch');
    background(0,0,0);
}

function reset () {
    const squareSize = min(windowWidth-30, windowHeight-30);
    resizeCanvas(squareSize, squareSize);
    clear();
    background(0,0,0);
}

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

    const min = range.min || 0;
    const max =  range.max || 100;

    const offset = Number(((val - min) * 100) / (max - min));

    bubble.textContent = val;

    // yes, 14px is a magic number
    bubble.style.left = `calc(${offset}% - 14px)`;
   
}

// --------- Modale : save artwork ---------

let buttonModale = document.querySelector(".buttonModale");
let modale = document.querySelector(".superModale");
let closeButton = document.querySelector(".closeButton");
let body =  document.querySelector(".superBody");
let modaleBackground = document.querySelector(".modaleBackground");


function openModal(){
    noLoop();
    document.body.style.overflow = "hidden"; // Desable scrolling
    modale.classList.remove("hidden");
    modale.classList.add("translate");
    modaleBackground.classList.remove("hidden");
}
function closeModal(){
    document.body.style.overflow = "auto"; // Enable scrolling
    modale.classList.add("hidden");
    modale.classList.remove("translate");
    modaleBackground.classList.add("hidden");
}
if (buttonModale){
    buttonModale.addEventListener("click",openModal);
    closeButton.addEventListener("click",closeModal);
    modaleBackground.addEventListener("click", function(event) {
        if (event.target === modaleBackground) {
            closeModal();
        }
    });
 }



