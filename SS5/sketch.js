let serial;
let portName = 'COM6'; // Replace with your Arduino port
let mode = 0;           // LED mode

function setup() {
  createCanvas(800, 600); // window within requirements
  serial = new p5.SerialPort();
  serial.open(portName);
}

function draw() {
  background(50);

  // Dynamic ellipse controlled by LED mode
  fill(255, 100, 150);
  let circleSize = map(mode, 0, 1, 50, 200);
  ellipse(width / 2, height / 2, circleSize, circleSize);

  // Dynamic rectangle
  fill(100, 200, 250);
  let rectX = frameCount % width;
  rect(rectX, height - 100, 60, 60);

  // Dynamic line
  stroke(255);
  strokeWeight(2);
  line(0, frameCount % height, width, frameCount % height);
}

// Change LED mode with mouse click
function mousePressed() {
  mode = (mode + 1) % 2; // toggle between 0 and 1
  serial.write(mode.toString()); // send to Arduino
}
