
// --------------------- Random line walkers --------------------------

//Catch data from DB:
let dataScene;
function preload() {
  const dataSceneDiv = document.getElementById('dataScene');
  if (dataSceneDiv.dataset.scene) {
    dataScene = JSON.parse(dataSceneDiv.dataset.scene);
  }  else {
    console.log("No scene data found");
  }
}

// Variables

let cell = 1;
let walkers = [];

let lineSlider;
let colorSlider;
let weightSlider;
let saturationSlider;
let opacitySlider;
let velocitySlider;
let noiseOctaveSlider;
let noiseFalloffSlider;
let sendDataButton = document.querySelector("#sendDataButton");
let checkboxStop;
let resetButton;

// Setup 

function setup() {
  
  const squareSize = min(windowWidth, windowHeight);
  const canvas = createCanvas(squareSize, squareSize);
  canvas.parent('sketch');
  colorMode(HSB);
  background(0,0,0);

  // Default parameters values
 
  // let defaultValueLine = dataScene ? dataScene.num_line : 100;
  // let defaultValueColor = dataScene ? dataScene.color : 5;
  // let defaultValueWeight = dataScene ? dataScene.weight : 8;
  // let defaultSaturation= dataScene ? dataScene.saturation : 90;
  // let defaultOpacity= dataScene ? dataScene.opacity : 0.7;
  // let defaultVelocity= dataScene ? dataScene.velocity : 5;
  // let defaultNoiseOctave= dataScene ? dataScene.noiseOctave : 4;
  // let defaultNoiseFalloff= dataScene ? dataScene.noiseFalloff : 0.5;

  // User Interface :
  
  // checkboxStop = createCheckbox("Stop and go", false);
  // checkboxStop.position(10, 170);
  // resetButton = createButton("Reset");
  // resetButton.position(130, 170);
  checkboxStop = select("#checkboxStop");
  resetButton = select("#resetButton");


  resetButton.mousePressed(() => {
      reset(); // Reset the canvas to its initial state
  });

  colorSlider = select('#colorSlider');
  lineSlider = select('#lineSlider');
  weightSlider = select('#weightSlider');
  saturationSlider = select('#saturationSlider');

  opacitySlider = select('#opacitySlider');
  velocitySlider = select('#velocitySlider');
  noiseOctaveSlider = select('#noiseOctaveSlider');
  noiseFalloffSlider = select('#noiseFalloffSlider');
  



  // lineSlider = createSlider(1, 100, defaultValueLine, 1).position(squareSize, squareSize).size(80);
  // colorSlider = createSlider(0, 360, defaultValueColor, 10).position(10, 30).size(80);
  // weightSlider = createSlider(0.2, 10, defaultValueWeight, 0.1).position(10, 50).size(80);
  // saturationSlider = createSlider(0, 100, defaultSaturation, 5).position(10, 70).size(80);
  // opacitySlider = createSlider(0.05, 1, defaultOpacity, 0.05).position(10, 90).size(80);
  // velocitySlider = createSlider(0, 15, defaultVelocity, 0.1).position(10, 110).size(80);
  // noiseOctaveSlider = createSlider(0, 10, defaultNoiseOctave, 1).position(10, 130).size(80);
  // noiseFalloffSlider = createSlider(0, 1, defaultNoiseFalloff, 0.05).position(10, 150).size(80);

  // Create un first walker serie in the center when app is open

  // for (let i = 0; i < 30; i++) {
  //   walkers.push(new Walker(width/2, height/2));
  //   walkers.forEach((walker)=> (walker.draw()));;
  // }
}

// Draw

function draw(){
// console.log((color(150,100, 100, 52).levels));
// console.log(
//   lineSlider.value() + ' - ' +
//   colorSlider.value() + ' - weight : ' +
//   weightSlider.value() + ' - ' +
//   saturationSlider.value() + ' - opacity : ' +
//   opacitySlider.value() + ' - ' +
//   velocitySlider.value() + ' - ' +
//   noiseOctaveSlider.value() + ' - ' +
//   noiseFalloffSlider.value() + ' - ' );

  walkers.forEach(walker => {
    if (!walker.isOut()) {
      walker.velocity();
      walker.move();
      walker.draw();
    }
    
  });
}


function windowResized() {
  const squareSize = min(windowWidth, windowHeight);
  const canvas = createCanvas(squareSize, squareSize);
  canvas.parent('sketch');
  background(0,0,0);
}

function reset () {
  const squareSize = min(windowWidth, windowHeight);
  resizeCanvas(squareSize, squareSize);
  walkers = [];
  clear();
  background(0,0,0);
}


class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.velocityX = random(-velocitySlider.value(), velocitySlider.value());
    this.velocityY = random(-velocitySlider.value(),velocitySlider.value());
    this.color = color(random(colorSlider.value(), (colorSlider.value() + 200)), saturationSlider.value(), 100, opacitySlider.value());
    this.draw();
  }
  velocity () {
    this.velocityX += map(noise(this.x * 0.005, this.y * 0.005, millis() * 0.001), 0, 1, -1, 1);
    this.velocityY += map(noise(this.y * 0.005, this.x * 0.005, millis() * 0.001), 0, 1, -1, 1);
  }
  isOut () {
    return(this.x < 0 || this.x > width || this.y < 0 || this.y > height);
  }
  move () {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
  draw () {
    line(this.x, this.y, this.px, this.py);
    this.px = this.x;
    this.py = this.y;
    noFill();
    noiseDetail(noiseOctaveSlider.value(), noiseFalloffSlider.value());
    stroke(random(colorSlider.value(), (colorSlider.value() + 200)), saturationSlider.value(), 100, opacitySlider.value());
    strokeCap(SQUARE);
    blendMode(SCREEN);
    // smooth();
    strokeWeight(weightSlider.value());
  }
}

function mouseClicked () {
  if (checkboxStop.checked()) {
    walkers = []; // -> to set only one walker for one click and stop the others walkers moves
  } 
  noiseSeed(random(50));

  for (let i = 0; i < lineSlider.value(); i++){
    walkers.push(new Walker(mouseX, mouseY));

  }
  
}



// Send to backend :

sendDataButton.addEventListener('click', function () {
  sendData()
});


function sendData(){
  let color = colorSlider.value();
  let weight = weightSlider.value();
  let numLine = lineSlider.value();
  let saturation = saturationSlider.value();
  let opacity = opacitySlider.value();
  let velocity = velocitySlider.value();
  let noiseOctave = noiseOctaveSlider.value();
  let noiseFalloff = noiseFalloffSlider.value();
   
    // Capture image of the canva

    // Capture l'image du canva dans un format base64
    const myCanvas = document.getElementById("defaultCanvas0");
    const imageBase64 = myCanvas.toDataURL();
    // const imageBase64 = canvas.elt.toDataURL();

    // Créez une nouvelle image à partir de l'URL base64
    const image = new Image();
    image.src = imageBase64;

    // Lorsque l'image est chargée, envoyez-la au serveur
    image.onload = function() {
      const formData = new FormData(); // or new URLSearchParams()
      formData.append('color', color);
      formData.append('weight', weight);
      formData.append('numLine', numLine);
      formData.append('saturation', saturation);
      formData.append('opacity', opacity);
      formData.append('velocity', velocity);
      formData.append('noiseOctave', noiseOctave);
      formData.append('noiseFalloff', noiseFalloff);
      formData.append('userId', userId);
      formData.append('file', image.src);
      
      // saveCanvas();
      fetch('/generative/sendData', {
          method: 'POST',
          body: formData
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(data => {
          console.log('Data sent successfully:', data);
      // Redirection vers la page 'gallery'
          // window.location.href = '/gallery';
      })
      .catch(error => {
          console.error('There was a problem sending the data:', error);
      });
    };
  }
  
  // Sliders animation
    
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



