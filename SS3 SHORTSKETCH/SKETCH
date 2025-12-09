let port;
let sensorVal = 0;
let writer;

function setup() {
  // Set canvas size constraints
  let w = constrain(windowWidth, 400, 1080);
  let h = constrain(windowHeight, 400, 720);
  createCanvas(w, h);
  noStroke();

  // Connect button
  const connectBtn = createButton("Connect Sensor");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectSerial);
}

function draw() {
  background(map(sensorVal, 0, 1023, 50, 255), 100, 150); // Background color

  // Circle - size controlled by sensor
  fill(255, map(sensorVal, 0, 1023, 50, 255), 200);
  let circleSize = map(sensorVal, 0, 1023, 50, 300);
  ellipse(width / 2, height / 2, circleSize, circleSize);

  // Rectangle - horizontal position controlled by sensor
  fill(map(sensorVal, 0, 1023, 0, 255), 100, 200);
  let rectX = map(sensorVal, 0, 1023, 0, width - 100);
  rect(rectX, height - 100, 100, 50);

  // Triangle - vertical height controlled by sensor
  fill(200, 100, map(sensorVal, 0, 1023, 0, 255));
  let triHeight = map(sensorVal, 0, 1023, 20, 150);
  triangle(width / 2 - 40, height / 2 + 100,
           width / 2 + 40, height / 2 + 100,
           width / 2, height / 2 + 100 - triHeight);

  // Display sensor value
  fill(255);
  textSize(16);
  text("Sensor Value: " + sensorVal, 20, 60);
}

// ----------------- WebSerial -----------------
async function connectSerial() {
  if ("serial" in navigator) {
    try {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      writer = port.writable.getWriter();
      console.log("Connected to Sensor!");
      readSerial();
    } catch (err) {
      console.error("Serial connection failed:", err);
    }
  } else {
    alert("Web Serial API not supported in this browser.");
  }
}

async function readSerial() {
  const decoder = new TextDecoderStream();
  const inputDone = port.readable.pipeTo(decoder.writable);
  const inputStream = decoder.readable;
  const reader = inputStream.getReader();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      // Make sure it's a number and clamp between 0-1023 for analog
      sensorVal = constrain(int(value), 0, 1023);
    }
  }
}
