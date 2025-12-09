let channelValues = Array(8).fill(0);
let sliders = [];
let effectEnabled = false;
let effectType = "Pulse";
let effectSpeed = 0.5;
let effectIntensity = 0.5;
let dropdownOpen = false;
let fxOptions = ["Pulse", "Chase"];

// WebSerial port
let port;
let writer;

function setup() {
createCanvas(windowWidth, windowHeight);

// Create channel sliders
for (let i = 0; i < 8; i++) {
sliders.push(new ChannelSlider(50 + i * 60, 120, 200));
}

// Connect button
const connectBtn = createButton("Connect ESP32");
connectBtn.position(20, 20);
connectBtn.mousePressed(connectSerial);

// Reset button
const resetBtn = createButton("Reset");
resetBtn.position(150, 20);
resetBtn.mousePressed(() => sliders.forEach(s => s.value = 0));
}

function draw() {
background(245);
drawHeader();
drawFaders();
drawFXPanel();

if (effectEnabled) applyFX();
sendToArduino();
}

// ----------------- UI -----------------
function drawHeader() {
fill(20);
rect(0, 0, width, 60);
fill(255);
textSize(24);
text("MINI ION — P5 LIGHTING CONSOLE", 270, 37);
}

function drawFaders() {
textSize(16);
fill(0);
text("CHANNEL FADERS", 50, 100);

sliders.forEach((s, i) => {
s.update();
s.display();
fill(0);
text(`CH ${i + 1}`, s.x + 5, s.y + s.h + 20); // text below fader
});
}

function drawFXPanel() {
fill(230);
rect(600, 80, 270, 400, 10);

fill(0);
textSize(18);
text("EFFECTS", 680, 110);

// Dropdown
textSize(14);
fill(255);
rect(620, 130, 200, 30, 5);
fill(0);
text(`Effect: ${effectType}`, 630, 150);

if (dropdownOpen) {
fill(255);
rect(620, 160, 200, fxOptions.length * 30, 5);
fxOptions.forEach((opt, i) => {
fill(0);
text(opt, 630, 180 + i * 30);
});
}

// Speed & Intensity sliders
fill(0);
text("Speed", 620, 260);
effectSpeed = sliderBar(620, 270, 200, effectSpeed);
text("Intensity", 620, 330);
effectIntensity = sliderBar(620, 340, 200, effectIntensity);

drawButton(620, 400, 90, 35, "Enable FX", () => effectEnabled = true);
drawButton(730, 400, 90, 35, "Disable FX", () => effectEnabled = false);
}

// ----------------- FX Engine -----------------
function applyFX() {
let t = millis() / 1000;
sliders.forEach((s, i) => {
if (effectType === "Pulse") {
s.value = map(sin(t * 2 * effectSpeed), -1, 1, 0, effectIntensity * 255);
} else if (effectType === "Chase") {
let phase = i * 0.5;
s.value = map(sin(t * effectSpeed + phase), -1, 1, 0, effectIntensity * 255);
}
});
}

// ----------------- Mouse -----------------
function mousePressed() {
// Dropdown
if (mouseX > 620 && mouseX < 820 && mouseY > 130 && mouseY < 160) {
dropdownOpen = !dropdownOpen;
}
if (dropdownOpen) {
for (let i = 0; i < fxOptions.length; i++) {
if (mouseX > 620 && mouseX < 820 &&
mouseY > 160 + i * 30 &&
mouseY < 190 + i * 30) {
effectType = fxOptions[i];
dropdownOpen = false;
}
}
}
}

// ----------------- Slider class -----------------
class ChannelSlider {
constructor(x, y, h) {
this.x = x;
this.y = y;
this.h = h;
this.value = 0;
}

update() {
if (mouseIsPressed &&
mouseX > this.x && mouseX < this.x + 40 &&
mouseY > this.y && mouseY < this.y + this.h) {
let pct = 1 - (mouseY - this.y) / this.h;
this.value = constrain(pct * 255, 0, 255);
}
}

display() {
fill(200);
rect(this.x, this.y, 40, this.h);
fill(100, 150, 255);
let hFill = map(this.value, 0, 255, 0, this.h);
rect(this.x, this.y + this.h - hFill, 40, hFill);
}
}

// ----------------- Utility -----------------
function sliderBar(x, y, w, val) {
fill(200);
rect(x, y, w, 10, 5);

let knobX = x + val * w;
fill(100);
ellipse(knobX, y + 5, 15);

if (mouseIsPressed && dist(mouseX, mouseY, knobX, y + 5) < 10) {
val = constrain((mouseX - x) / w, 0, 1);
}
return val;
}

function drawButton(x, y, w, h, label, callback) {
fill(255);
rect(x, y, w, h, 5);
fill(0);
text(label, x + 10, y + h / 2 + 5);
if (mouseIsPressed &&
mouseX > x && mouseX < x + w &&
mouseY > y && mouseY < y + h) {
callback();
}
}

// ----------------- WebSerial -----------------
async function connectSerial() {
if ("serial" in navigator) {
try {
// Ask user to select port
port = await navigator.serial.requestPort();
await port.open({ baudRate: 9600 });
writer = port.writable.getWriter();
console.log("Connected to ESP32!");
} catch (err) {
console.error("Serial connection failed:", err);
}
} else {
alert("Web Serial API not supported in this browser.");
}
}

async function sendToArduino() {
if (!writer) return;
let data = sliders.map(s => floor(s.value)).join(",");
try {
await writer.write(new TextEncoder().encode(data + "\n"));
} catch (err) {
console.error("Failed to send:", err);
}
}
