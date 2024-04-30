// First : load the data to extract counties name to fill up the select options in html

window.onload = function() {
    fetch("/data/historical_emissions.csv")
       .then(response => response.text())
       .then(data => {
            const rows = data.split('\n');
            const countryNames = rows.map(row => row.split(',')[1]);
            // console.log(countryNames);
            const selectElements = document.querySelectorAll('.country');

            for (let i = 0; i < selectElements.length; i++) {
                const select = selectElements[i];
                for (let j = 0; j < countryNames.length; j++) {
                    const option = document.createElement('option');
                    option.value = countryNames[j];
                    option.text = countryNames[j];
                    select.add(option);
                }
                select.remove(1); // Remove the first option (index 0)
                select.remove(select.length - 1); // Remove the last option
            }
        });
};

// Then preload the data before running the p5js script

function preload(){
    table = loadTable("/data/historical_emissions.csv", "csv", "header")
}

let isAnimated = false;
let table;
let countryNamesObj = {};
let dataObj ={};
let circleDiam;
let i = 1;
let countriesArray = []
let originArray = ["top", "top", "right", "right", "bottom", "bottom", "left", "left"]
let offset;
let submitButton = document.querySelector('#submitButton');
let reloadButton = document.querySelector('#reloadButton');
let checkboxLoop;
let checkboxFlag;

// Initial setup

function setup(){
    const squareSize = min(windowWidth, windowHeight);
    const canvas = createCanvas(squareSize, squareSize);
    canvas.parent('sketch');
    // console.log(width);
    
    // width = 800 - (800 - 600) / 2; // Set the width to 600 pixels with padding on each side
    // height = 800 - (800 - 600) / 2;
    // width = width-(width/3);
    // height = height-(height/3);
    colorMode(HSB);
    frameRate(60);

    // Create a vertical gradient background

    background(0);
    noStroke(); 
    for (let i = 0; i < height; i++) {
      let brightness = map(i, 0, height, 0, 100); // Map the y-position to a brightness value
      fill(brightness);
      rect(0, i, width, 1); // Draw a rectangle with the calculated brightness
    }

    checkboxLoop = select("#checkboxLoop");
    checkboxFlag = select("#checkboxFlag");
    randomSlider = select('#randomSlider');

    submitButton.addEventListener('click', function() {
        countriesArray = [];
        document.querySelectorAll('.country').forEach(function(select) {
          countriesArray.push(select.value);
        });
        runAnimation();
      console.log(isAnimated + "  -  " + countriesArray);
      
    });
    reloadButton.addEventListener('click', function() {
        window.location.reload();
    });
    let countries = table.rows;
    for (let i=0 ; i < countries.length ; i++){
        let countriesName = countries[i].arr[1];
        co2Data = Object.values(countries[i].obj)
        dataObj[countriesName]= co2Data;

    }
    for (const key in dataObj) {
        if (Object.hasOwnProperty.call(dataObj, key)) {
            const element = dataObj[key];
            dataObj[key] = averageValues (dataObj[key])          
        }
    }

    // console.log(dataObj["China"]);
    // CHIcircleDiam = dataObj["Chine"];

    // console.log(circleDiam);

}

// 30 ans de data

function draw(){
    // ------ Offset between 1 et 2000 -------
    // chooseDisplay(countriesArray, originArray)
    console.log(isAnimated);

    if (isAnimated){
        countriesArray[0] != "" ? drawData(countriesArray[0], i, 100, originArray[0]) : null;
        countriesArray[1] != "" ? drawData(countriesArray[1], i, 300, originArray[1]): null;
        countriesArray[2] != "" ? drawData(countriesArray[2], i, 500, originArray[2]): null;
        countriesArray[3] != "" ? drawData(countriesArray[3], i, 700, originArray[3]): null;
        countriesArray[4] != "" ? drawData(countriesArray[4], i, 900, originArray[4]): null;
        countriesArray[5] != "" ? drawData(countriesArray[5], i, 1100, originArray[5]): null;
        countriesArray[6] != "" ? drawData(countriesArray[6], i, 1300, originArray[6]): null;
        countriesArray[7] != "" ? drawData(countriesArray[7], i, 1500, originArray[7]): null;

        i++
        if (i == 250){
            noLoop();
        }

        // ------ LOOPING ------ :
        if (checkboxLoop.checked()) {
            if (i == 240){
                i=0;
            }
        } 
    }
    
}

function windowResized() { 
    const squareSize = min(windowWidth, windowHeight);
    const canvas = createCanvas(squareSize, squareSize);
    canvas.parent('sketch');
    // Create a vertical gradient background

    background(0);
    noStroke(); 
    for (let i = 0; i < height; i++) {
        let brightness = map(i, 0, height, 0, 100); // Map the y-position to a brightness value
        fill(brightness);
        rect(0, i, width, 1); // Draw a rectangle with the calculated brightness
    }
    
  }
  

function runAnimation() {
    isAnimated = !isAnimated;
}
  


function handleSubmit(){
    for (let i = 0; i < 8; i++) {
        countriesArray.push(select('#country' + i).value());
      }
}
function drawData(country, i, offset, origin){
    let x;
    let y;
    let txtX;
    let txtY;
    let posOffset = map(offset, 0, 1500, 0, 4000)
    // console.log("--->" + posOffset); 
    switch (origin) {
        case "left":
            x = 0 + width*(i/250);
            y = map(noise(posOffset + randomSlider.value() * i), 0, 1, 0, height)
            txtX = x + 25;
            txtY = y-40 ;
            // console.log("left : " + y);
            break;
        case "right":
            x = width - width*(i/250);
            y = map(noise( posOffset + randomSlider.value() * i) , 0, 1, 0, height)
            txtX = x-110 ;
            txtY = y -40 ;
            // console.log(txtY)
            break;
        case "bottom":
            y = height - height*(i/250);
            x = map(noise(posOffset + randomSlider.value() * i), 0, 1, 0, width)
            txtX = x + 25 ;
            txtY = y -40 ;
            break;
        case "top":
            y = 0 + height*(i/250);
            x = map(noise(posOffset + randomSlider.value() * i), 0, 1, 0, width)
            txtX = x + 25 ;
            txtY = y +40 ;
            break;
        default:
            console.log("Invalid origin.");
            break;
    }
    let colorOffset = map(offset, 0, 2000, 0, 360)
    circleDiam = dataObj[country];
    let color = map(circleDiam[i], -50, 10297, 100 + colorOffset , 360 )
    fill(color, 100, 100)
    setTimeout(() => {
        if(i<2){
            push()
            fill(color, 100, 100)
            strokeWeight(4);
            stroke(0);
            text(country, txtX, txtY);
            pop()
        }
    }, 900);

  
    stroke(255)
    textSize(35)
    countryNamesObj[country] = origin; // Get the origin of the choosen countries to display on the html
    // console.log(country);
 
    circle(x,y,circleDiam[i]/60) // MAP SCALE ON SLIDER (diam/scale)

    //------ Data number flag / banner -------
    if (checkboxFlag.checked()) {
        push()
        fill(color-random(0, 70), 100, 100)
        strokeWeight(2);
        textSize(20);
        text(dataObj[country], x+offset/4-150, y+offset/3-150);
        pop()
    } 
 
}


function averageValues (array){
    let newArray = [];
    let secondArray = [];
    let finalArray = [];
    doubleArray (array, newArray, 6);
    doubleArray (newArray, secondArray, 1);
    doubleArray (secondArray, finalArray, 1);
    // console.log(finalArray);
    return finalArray;
}
function doubleArray (array, newArray, minus) {
    for (let h = 0; h < array.length -minus; h++) {
        let current = parseFloat(array[h]);
        let next = parseFloat(array[h + 1]);
        let average = (current + next) / 2;
        newArray.push(current);
        newArray.push(average);
    } 
    return newArray;
}


// Send to backend :

document.querySelector("#sendDataButton")?.addEventListener('click', function () {
    sendData()
  });
  
function sendData(){

    let randomness = randomSlider.value();
    let looping = checkboxLoop.checked() ? 1 : 0;
    let abstract = checkboxFlag.checked() ? 1 : 0;
    let country1 = select("#country0").value()
    let country2 = select("#country1").value()
    let country3 = select("#country2").value()
    let country4 = select("#country3").value()
    let country5 = select("#country4").value()
    let country6 = select("#country5").value()
    let country7 = select("#country6").value()
    let country8 = select("#country7").value()

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
    formData.append('randomness', randomness);
    formData.append('looping', looping);
    formData.append('abstract', abstract);
    formData.append('country1', country1 ? country1 : "");
    formData.append('country2', country2? country2 : "");
    formData.append('country3', country3? country3 : "");
    formData.append('country4', country4? country4 : "");
    formData.append('country5', country5? country5 : "");
    formData.append('country6', country6? country6 : "");
    formData.append('country7', country7? country7 : "");
    formData.append('country8', country8? country8 : "");
    formData.append('userId', userId);
    formData.append('file', image.src);

    console.log(formData.get('randomness'));
    console.log(formData.get('looping'));
    console.log(formData.get('abstract'));
    console.log(formData.get('country1'));
    console.log(formData.get('country2'));
    console.log(formData.get('country3'));
    console.log(formData.get('country4'));
    console.log(formData.get('country5'));
    console.log(formData.get('country6'));
    console.log(formData.get('country7'));
    console.log(formData.get('country8'));
    console.log(formData.get('userId'));
     console.log(formData.get('file'));
  
    fetch('/dataScene/sendDataD1', {
        method: 'POST',
        body: formData,
        // headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log('Data sent successfully:', data);
    // Redirection vers la page 'sceneD1'
        window.location.href = '/sceneD1';
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
