let serial;
let portName = 'COM6';      
let options = { baudRate: 9600 };
let sensorVal = 0;
let writer;

function setup() {
  
  let w = constrain(windowWidth, 400, 1080);
  let h = constrain(windowHeight, 400, 720);
  createCanvas(w, h);
  noStroke();
  textSize(16);
  
 
  const connectBtn = createButton("Connect Sensor");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectSerial);
}

function draw() {
  background(map(sensorVal, 0, 1023, 50, 255), 100, 150); 
  
  // Circle - size controlled by sensor
  fill(255, map(sensorVal, 0, 1023, 50, 255), 200);
  let circleSize = map(sensorVal, 0, 1023, 50, 300);
  ellipse(width / 2, height / 2, circleSize, circleSize);
  
  
  fill(map(sensorVal, 0, 1023, 0, 255), 100, 200);
  let rectX = map(sensorVal, 0, 1023, 0, width - 100);
  rect(rectX, height - 100, 100, 50);
  
  
  fill(200, 100, map(sensorVal, 0, 1023, 0, 255));
  let triHeight = map(sensorVal, 0, 1023, 20, 150);
  triangle(width / 2 - 40, height / 2 + 100,
           width / 2 + 40, height / 2 + 100,
           width / 2, height / 2 + 100 - triHeight);
  
  
  fill(255);
  text("Sensor Value: " + sensorVal, 20, 60);
}


function connectSerial() {
  // Initialize p5.SerialPort
  serial = new p5.SerialPort();
  serial.on('list', printList);
  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('close', portClose);
  serial.list();
  serial.open(portName, options);
}

function printList(portList) {
  print('Available Serial Ports:');
  for (let i = 0; i < portList.length; i++) {
    print(i + ': ' + portList[i]);
  }
}

function serverConnected() {
  print('CONNECTED TO SERVER');
}

function portOpen() {
  print('SERIAL PORT OPEN');
}

function portClose() {
  print('SERIAL PORT CLOSED');
}

function serialError(err) {
  print('ERROR: ' + err);
}

function serialEvent() {
  
  let data = serial.readLine();
  if (!data) return;
  data = data.trim();
  if (data.length === 0) return;
  
  
  let value = parseInt(data, 10);
  if (!isNaN(value)) {
    sensorVal = constrain(value, 0, 1023);
  }
}
