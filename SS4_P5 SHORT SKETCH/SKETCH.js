let serial;
let portName = 'COM6';      
let options = { baudRate: 9600 };

let b1 = 0, b2 = 0;
let pot1 = 0, pot2 = 0;

function setup() {
 
  createCanvas(800, 600);
  textSize(14);
  noStroke();

  
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

function draw() {
  
  let bg = map(pot1, 0, 255, 30, 240);               // background brightness
  let circleSize = map(pot2, 0, 255, 40, min(width, height) * 0.6);
  let rectX = map(pot1, 0, 255, 0, width - 120);     // rect horizontal
  let triHeight = map(pot2, 0, 255, 20, 140);

  // If button 1 pressed, invert background colors 
  if (b1 === 1) {
    background(255 - bg, 255 - bg * 0.6, 255 - bg * 0.2);
  } else {
    background(bg, bg * 0.6, 200);
  }

  // Circle in center (circle )
  fill(map(pot1, 0, 255, 40, 255), map(pot2, 0, 255, 80, 200), 180);
  ellipse(width/2, height/2, circleSize, circleSize);

  // Rectangle at bottom (rect )
  fill(200, map(pot1, 0, 255, 80, 200), 200);
  rect(rectX, height - 120, 120, 60, 8);

  // Triangle near top (triangle )
  fill(100, 180, map(pot2, 0, 255, 100, 220));
  triangle(width/2 - 40, height/2 - 90, width/2 + 40, height/2 - 90, width/2, height/2 - 90 - triHeight);

 
  if (b2 === 1) {
    fill(255, 255, 255, 180);
    for (let i = 0; i < 10; i++) {
      ellipse(random(width), random(height), random(3,10));
    }
  }

  
  fill(0, 140);
  rect(10, 10, 230, 80, 6);
  fill(255);
  text('Button1 (b1) = ' + b1, 18, 18);
  text('Button2 (b2) = ' + b2, 18, 36);
  text('Pot1 = ' + pot1 + '  Pot2 = ' + pot2, 18, 54);
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

 
  let parts = data.split(',');
  if (parts.length >= 4) {
    let nb1 = parseInt(parts[0], 10);
    let nb2 = parseInt(parts[1], 10);
    let np1 = parseInt(parts[2], 10);
    let np2 = parseInt(parts[3], 10);

    if (!isNaN(nb1)) b1 = constrain(nb1, 0, 1);
    if (!isNaN(nb2)) b2 = constrain(nb2, 0, 1);
    if (!isNaN(np1)) pot1 = constrain(np1, 0, 255);
    if (!isNaN(np2)) pot2 = constrain(np2, 0, 255);
  } else {
    print('Malformed serial line: "' + data + '"');
  }
}
