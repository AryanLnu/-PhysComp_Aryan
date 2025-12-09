let serial;
let portName = 'COM6'; 
let mode = 0;           

function setup() {
  createCanvas(800, 600); 
  serial = new p5.SerialPort();
  serial.open(portName);
}

function draw() {
  background(50);


  fill(255, 100, 150);
  let circleSize = map(mode, 0, 1, 50, 200);
  ellipse(width / 2, height / 2, circleSize, circleSize);


  fill(100, 200, 250);
  let rectX = frameCount % width;
  rect(rectX, height - 100, 60, 60);

  
  stroke(255);
  strokeWeight(2);
  line(0, frameCount % height, width, frameCount % height);
}


function mousePressed() {
  mode = (mode + 1) % 2; // toggle between 0 and 1
  serial.write(mode.toString()); // send to Arduino
}
