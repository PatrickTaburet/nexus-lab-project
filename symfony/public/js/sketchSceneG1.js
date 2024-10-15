
// --------------------- Random line walkers --------------------------

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
let checkboxStop;
let resetButton;

// Setup 

function setup() {
  
  const squareSize = min(windowWidth-30, windowHeight-30);
  const canvas = createCanvas(squareSize, squareSize);
  canvas.parent('sketch');
  canvas.id('myCanvas');
  colorMode(HSB);
  background(0,0,0);

  // User Interface :

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

  // Create un first walker serie in the center when app is open

  // for (let i = 0; i < 30; i++) {
  //   walkers.push(new Walker(width/2, height/2));
  //   walkers.forEach((walker)=> (walker.draw()));;
  // }
}

// Draw

function draw(){
  if (modale.classList.contains("hidden")) { //  Stop the animation/interactions when modale is open
    walkers.forEach(walker => {
      if (!walker.isOut()) {
        walker.velocity();
        walker.move();
        walker.draw();
      }
      
    });
    return;
  }
 
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


// --------- Send to backend ---------

document.querySelector("#sendDataButton")?.addEventListener('click', function () {
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
    const myCanvas = document.getElementById("myCanvas");
    const imageBase64 = myCanvas.toDataURL();

    // Créez une nouvelle image à partir de l'URL base64
    const image = new Image();
    image.src = imageBase64;

    // Lorsque l'image est chargée, envoyez-la au serveur
    image.onload = function() {
      const formData = new FormData(); 
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
      
      fetch('/generative/sendDataG1', {
          method: 'POST',
          body: formData
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log('Data sent successfully:', data);
      // Redirection vers la page 'sceneG1'
        window.location.href = data.redirectUrl;
      })
      .catch(error => {
          console.error('There was a problem sending the data:', error);
      });
    };
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
 


