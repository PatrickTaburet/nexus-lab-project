let prevX, prevY;
let mainColor;
let colors =[];
let lines = [];
let lineSlider;

function setup(){
    const canvas = createCanvas(windowWidth, windowHeight*2);
    canvas.parent('sketch1');
    canvas.id('myCanvas');
    colorMode(HSB, 360, 100, 100, 1);
    frameRate(50);
    background(217, 54, 11);
    // noStroke(); 
    prevX = mouseX;
    prevY = mouseY;
    strokeWeight(3);
    colors = [
      color(180, 100, 50, 1),  // Cyan translucide
      color(300, 100, 50, 1),  // Magenta translucide
      color(120, 100, 50, 1),  // Vert translucide
      color(60, 100, 50, 1)    // Jaune translucide
    ];
    lines.push({
      prevX: mouseX,
      prevY: mouseY,
    })

    // User Interface

    lineSlider = select('#lineSlider');
}

function draw(){
  if(!mainColor){
    mainColor = color(180, 100, 50, 1)
  }
  for (let mainLine of lines) {
    stroke(mainColor);

    let stepSize = random(10, 30);
    let direction = floor(random(4));

    let newX = mainLine.prevX;
    let newY = mainLine.prevY;

    if (direction == 0) {
        newX += stepSize;  // Right
      } else if (direction == 1) {
        newX -= stepSize;  // Left
      } else if (direction == 2) {
        newY += stepSize;  // Down
      } else if (direction == 3) {
        newY -= stepSize;  // Up
      }
    
    line(mainLine.prevX, mainLine.prevY, newX, newY);

    mainLine.prevX = newX;
    mainLine.prevY = newY;

     // Adding randlomly new lines 
    rand = floor(random(30));
    if (rand == 2){
      if (lines.length < lineSlider.value()){
        lines.push({
          prevX: newX,
          prevY:  newY,
        })

      }
    }
  }
  // Black translucent layer to create a fade effect

    fill(0, 0, 0, 0.03); 
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
  // Reposition the starting line when mouse moves
  for (let line of lines) {
    line.prevX = mouseX;
    line.prevY = mouseY;
  }
  lines=[];
  lines.push({
    prevX: mouseX,
    prevY: mouseY,
  })
}
function mouseClicked(){
  mainColor = random(colors);
}

