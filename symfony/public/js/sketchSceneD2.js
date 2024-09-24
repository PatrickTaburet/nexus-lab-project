let USrowData;
let CHIrowData;
let INrowData;

let colors = {};
let origin = {};
let countries = [];
let origins = []; 
let directions = [];
let divFactorSlider;
let numCopySlider;
let deformationSlider;
let sizeFactorSlider;
let angleDivSlider;
let opacitySlider;
let colorsButton;
let colorRangeSlider;
let filterSlider;
let glitchMode;
let noiseMode;
let blendModes=[];
let opacityValue;
let blendModeValue;
let divSlider;
let chinaColor;
let usaColor;
let indiaColor;
let totalArea;
let noiseCheckbox;
let glitchCheckbox;
let reloadButton;


function preload() {
    USrowData = loadJSON("/data/dataS2/Us_pop.txt");
    INrowData = loadJSON("/data/dataS2/India_pop.txt");
    CHIrowData = loadJSON("/data/dataS2/China_pop.txt");
}

function setupSliders() {
    divFactorSlider = select(".divFactorSlider");
    numCopySlider = select(".numCopySlider");
    deformationSlider = select(".deformationSlider");
    sizeFactorSlider = select(".sizeFactorSlider");
    angleDivSlider = select(".angleDivSlider");
    opacitySlider = select(".opacitySlider");
    colorRangeSlider = select(".colorRangeSlider");
    filterSlider = select(".filterSlider");
    divSlider = select(".divSlider");
}

function setupButtons(){
    
    reloadButton = document.querySelector('#reloadButton');
    colorsButton = select(".colorsButton");
    noiseCheckbox = select("#noiseCheckbox");
    glitchCheckbox = select("#glitchCheckbox");

    reloadButton.addEventListener('click', function() {
        window.location.reload();
    });
    colorsButton.mousePressed(changeColors);
    glitchMode = glitchCheckbox.checked();
    noiseMode = noiseCheckbox.checked();
    noiseCheckbox.changed(toggleNoiseMode);
    glitchCheckbox.changed(toggleGlitchMode);

}

function setupColors(){
    chinaColor = select(".chinaColor");
    usaColor= select(".usaColor");
    indiaColor= select(".indiaColor");
        
    if (window.newColors){
        colors = {
            china: newColors.usa,
            india: newColors.china,
            usa: newColors.india,
        };
        chinaColor.style("color", HSBtoHex(colors).china);
        usaColor.style("color", HSBtoHex(colors).usa);
        indiaColor.style("color", HSBtoHex(colors).india);
    }else{
        colors = {
            china: colors.china | 255,
            india: colors.india | 150,
            usa: colors.usa | 50,
        };
    }
}

function setup() {
    const squareSize = min(windowWidth-30, windowHeight-30);
    const canvas = createCanvas(squareSize, squareSize);
    canvas.parent('sketch');
    canvas.id('myCanvas');
    colorMode(HSB);
    background(0, 0, 0);
    noStroke();
    frameRate(30);

    blendModes = [BLEND, DIFFERENCE, REPLACE, HARD_LIGHT, ADD];
    setupSliders()
    setupButtons()
    setupColors();

    totalArea = width * height;
    let dataManager = new DataManager(USrowData, CHIrowData, INrowData);
    dataManager.calculateAreas();

    let usa = new Country('usa', dataManager);
    let china = new Country('china', dataManager);
    let india = new Country('india', dataManager);
    countries = [usa, china, india];


    initializeOrigins();
    initializeDirections();
}

function draw() {
    background(0, 0, 0);

    // GLitch mode settings
    if(!glitchMode){
        blendMode(BLEND); 
    }
    opacityValue = glitchMode ? 1 : opacitySlider.value();
    blendModeValue = glitchMode ? 1 : filterSlider.value();
    
    blendMode(blendModes[blendModeValue % blendModes.length]);
   console.log(blendModes[filterSlider.value()]);
    // Drawing
    let divFactor = divFactorSlider.value();
    for (let i = 0; i < divFactor; i++) {
        countries.forEach((country, index) => {
            let originIndex = index * divFactor + i;
            let directionIndex = index * divFactor + i;
            if (originIndex < origins.length && directionIndex < directions.length) {
                country.drawData(origins[originIndex], directions[directionIndex]);
            }
    });
    } 
}
function toggleNoiseMode() {
    noiseMode = !noiseMode;
  }
function toggleGlitchMode() {
    glitchMode = !glitchMode;
  }
function windowResized() {
    const squareSize = min(windowWidth-30, windowHeight-30);
    const canvas = createCanvas(squareSize, squareSize);
    canvas.parent('sketch');
    canvas.id('myCanvas');
    colorMode(HSB);
    background(0, 0, 0);
}

function mouseClicked() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    initializeOrigins(true);
    initializeDirections(true);
    }
}

function changeColors() {

    //Hue value
    colors.usa = random(360) + colorRangeSlider.value();
    colors.china = random(360)+ colorRangeSlider.value();
    colors.india = random(360)+ colorRangeSlider.value();

    chinaColor.style("color", HSBtoHex(colors).china);
    usaColor.style("color", HSBtoHex(colors).usa);
    indiaColor.style("color", HSBtoHex(colors).india);
}

function HSBtoHex(colors){
    let chinaHue =  colors.china % 360;
    let usaHue = colors.usa % 360;
    let indiaHue = colors.india % 360;

    //HSB color value
    let chinaColorHSB = color(chinaHue, 100, 100);
    let usaColorHSB = color(usaHue, 100, 100);
    let indiaColorHSB = color(indiaHue, 100, 100);


    // Hexadécimal conversion
    let chinaHex = '#' + hex(chinaColorHSB.levels[0], 2) + hex(chinaColorHSB.levels[1], 2) + hex(chinaColorHSB.levels[2], 2);
    let usaHex = '#' + hex(usaColorHSB.levels[0], 2) + hex(usaColorHSB.levels[1], 2) + hex(usaColorHSB.levels[2], 2);
    let indiaHex = '#' + hex(indiaColorHSB.levels[0], 2) + hex(indiaColorHSB.levels[1], 2) + hex(indiaColorHSB.levels[2], 2);

    return hexColors = {
        china : chinaHex,
        usa : usaHex,
        india : indiaHex
    }
}

// Random origins
function initializeOrigins(randomize = false) {
    let divFactor = divFactorSlider.value();
    origins = [];
    if (divFactor === 1 && !randomize) {
        countries.forEach(() => {
            origins.push({ x: width / 2, y: height / 2 });
        });
    } else {
        for (let i = 0; i < divFactor; i++) {
            countries.forEach(() => {
                origins.push({ x: random(width), y: random(height) });
            });
        }
    }
}

// Random directions
function initializeDirections(randomize = false) {
    directions = [];
    let divFactor = divFactorSlider.value();
    if (divFactor === 1 && !randomize) {
        countries.forEach(() => {
            directions.push({ x: 0, y: 0 });
            });

    } else {
        for (let i = 0; i < divFactor; i++) {
            countries.forEach(() => {
                let angle = random(TWO_PI);  
                directions.push({
                    x: cos(angle),  
                    y: sin(angle) 
                });
            });
        }
    }
}

class DataManager {
    constructor(USData, CHIData, INData) {
        this.USData = this.extractData(USData);
        this.CHIData = this.extractData(CHIData);
        this.INData = this.extractData(INData);
        
        this.data = {
            usa: this.doubleTable(this.USData),
            china: this.doubleTable(this.CHIData),
            india: this.doubleTable(this.INData)
        };
        
        this.USAMaxPop = this.USData[this.USData.length - 1];
        this.CHIMaxPop = this.CHIData[this.CHIData.length - 1];
        this.INDiMaxPop = this.INData[this.INData.length - 1];
        
        this.totalPopulation = this.CHIMaxPop + this.USAMaxPop + this.INDiMaxPop;
        
        this.areas = {};
    }
    
    extractData(countryData) {
        let country = countryData[1].map(item => item.value);
        return country.reverse().slice(0, -1);
    }
    
    doubleTable(table) {
        let result = [table[0]];
        for (let i = 0; i < table.length - 1; i++) {
            let avg = (table[i] + table[i + 1]) / 2;
            result.push(avg, table[i + 1]);
        }
        return result;
    }
    
    calculateAreas() {
        this.areas.usa = (this.USAMaxPop / this.totalPopulation) * totalArea;
        this.areas.china = (this.CHIMaxPop / this.totalPopulation) * totalArea;
        this.areas.india = (this.INDiMaxPop / this.totalPopulation) * totalArea;
    }
}

class Country {
    constructor(name, dataManager) {
        this.name = name;
        this.dataManager = dataManager;
        this.data = dataManager.data[name];
        this.maxPop = this.data[this.data.length - 1];
        this.area = dataManager.areas[name];
        this.index = 0;
    }

    calculateParams() {
        this.index = frameCount % this.data.length;
        let proportion = this.data[this.index] / this.maxPop;
        let size = sqrt(proportion * this.area);
        return { size: size, index: this.index };
    }

    drawData(origin, direction) {
   
        let params = this.calculateParams();
        fill(colors[this.name], 100, 100, opacityValue);
        let x = params.index * direction.x + origin.x;
        let y = params.index *direction.y + origin.y;
        let size = params.size/divFactorSlider.value();
        if (x - size / 2 < 0) {
            x = size / 2;
        } else if (x + size / 2 > width) {
            x = width - size / 2;
        }
        if (y - size / 2 < 0) {
            y = size / 2;
        } else if (y + size / 2 > height) {
            y = height - size / 2;
        }
      
        // Kaleidoscopic effect with geometric deformation
        let numCopies = numCopySlider.value(); 
        let angleStep = TWO_PI / numCopies;  // Angle between each copy
        let deformationScale = deformationSlider.value(); 
        push();
        translate(x, y);
        for (let i = 0; i < numCopies; i++) { 
            push();
            rotate(i * angleStep);  // Rotate each copy

            let sizeFactor = sizeFactorSlider.value(); 

            // Deform the ellipse into a more complex shape
            beginShape();
            for (let angle = 0; angle < TWO_PI; angle += PI / angleDivSlider.value()) {
                let offsets = this.calculateOffsets(angle, deformationScale, sizeFactor, size);
                vertex(offsets.offsetX, offsets.offsetY);
            }
            endShape(CLOSE);
            pop();
        }
        pop();

    }
    calculateOffsets(angle, deformationScale, sizeFactor, size) {
        let offsetX, offsetY;
        let divValue = divSlider.value();
        let noiseScale = 0.1;
        if (noiseMode) {
            let noiseVal = noise(cos(angle) * noiseScale, sin(angle) * noiseScale, frameCount * noiseScale) * 23;
            offsetX = size / 2 * cos(angle) + noiseVal * (1 + deformationScale * sin(divValue * angle + frameCount * 0.05)) * sizeFactor;
            offsetY = size / 2 * sin(angle) + noiseVal * (1 + deformationScale * sin(divValue * angle + frameCount * 0.05)) * sizeFactor;
        } else {
            offsetX = size / 2 * cos(angle) * (1 + deformationScale * sin(divValue * angle + frameCount * 0.05)) * sizeFactor;
            offsetY = size / 2 * sin(angle) * (1 + deformationScale * sin(divValue * angle + frameCount * 0.05)) * sizeFactor;
        }
        return { offsetX, offsetY };
    }

}
// Send to backend :

document.querySelector("#sendDataButton")?.addEventListener('click', function () {
    sendData()
  });
  
function sendData(){
    let divFactor = divFactorSlider.value();
    let copy = numCopySlider.value();
    let deformation = deformationSlider.value();
    let sizeFactor = sizeFactorSlider.value();
    let angle = angleDivSlider.value();
    let opacity = opacitySlider.value();
    let filters = filterSlider.value();
    let division = divSlider.value();
    let colorRange = colorRangeSlider.value();
    let glitch = glitchCheckbox.checked() ? 1 : 0;
    let noise = noiseCheckbox.checked() ? 1 : 0;
    let colorsValue = JSON.stringify(colors);
   
    // Capture l'image du canva dans un format base64
    const myCanvas = document.getElementById("myCanvas");
    const imageBase64 = myCanvas.toDataURL();
    // const imageBase64 = canvas.elt.toDataURL();

    // Créez une nouvelle image à partir de l'URL base64
    const image = new Image();
    image.src = imageBase64;

    // Lorsque l'image est chargée, envoyez-la au serveur
    image.onload = function() {
        const formData = new FormData(); // or new URLSearchParams()
        formData.append('divFactor', divFactor);
        formData.append('copy', copy);
        formData.append('deformation', deformation);
        formData.append('sizeFactor', sizeFactor);
        formData.append('angle', angle);
        formData.append('opacity', opacity);
        formData.append('filters', filters);
        formData.append('division', division);
        formData.append('colorRange', colorRange);
        formData.append('glitch', glitch);
        formData.append('noise', noise);
        formData.append('colorsValue', colorsValue);
    
        formData.append('userId', userId);
        formData.append('file', image.src);
    
        fetch('/dataScene/sendDataD2', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data sent successfully:', data);
        // Redirection vers la page 'sceneD2'
            window.location.href = data.redirectUrl;    
        })
        .catch(error => {
            console.error('There was a problem sending the data:', error);
        });
    };
}


// User Interface

  
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
    loop();
  }
  if (buttonModale){
    buttonModale.addEventListener("click",openModal );
    closeButton.addEventListener("click",closeModal);
    modaleBackground.addEventListener("click", function(event) {
      if (event.target === modaleBackground) {
        closeModal();
      }
    });
  }