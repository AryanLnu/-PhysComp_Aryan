let channelValues = Array(8).fill(0);
let sliders = [];
let effectEnabled = false;
let effectType = "Pulse";
let effectSpeed = 0.5;
let effectIntensity = 0.5;
let dropdownOpen = false;
let fxOptions = ["Pulse", "Chase"];
let selectedChannels = Array(8).fill(true); // Track which channels get FX

// Grand Master and Groups
let grandMaster = 1.0; // 0.0 to 1.0
let blackoutActive = false;
let groups = [
  { name: "Group 1", channels: [0, 1], enabled: true },
  { name: "Group 2", channels: [2, 3], enabled: true },
  { name: "Group 3", channels: [4, 5], enabled: true },
  { name: "Group 4", channels: [6, 7], enabled: true }
];

// WebSerial port
let port;
let writer;
let reader;
let isConnected = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create channel sliders
  for (let i = 0; i < 8; i++) {
    sliders.push(new ChannelSlider(50 + i * 60, 120, 200));
  }

  // Connect button - positioned absolutely so it stays visible
  const connectBtn = createButton("Connect ESP32");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectSerial);
  connectBtn.style('position', 'fixed');
  connectBtn.style('z-index', '1000');

  // Reset button
  const resetBtn = createButton("Reset");
  resetBtn.position(150, 20);
  resetBtn.mousePressed(() => sliders.forEach(s => s.value = 0));
  resetBtn.style('position', 'fixed');
  resetBtn.style('z-index', '1000');
}

// Make canvas resize with window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(245);
  drawHeader();
  drawFaders();
  drawMasterAndGroups();
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
  
  // Connection status
  textSize(14);
  if (isConnected) {
    fill(0, 255, 0);
    text("● Connected", width - 150, 37);
  } else {
    fill(255, 0, 0);
    text("● Disconnected", width - 150, 37);
  }
}

function drawFaders() {
  textSize(16);
  fill(0);
  text("CHANNEL FADERS", 50, 100);

  sliders.forEach((s, i) => {
    s.update();
    s.display();
    
    // Channel number
    fill(0);
    text(`CH ${i + 1}`, s.x + 5, s.y + s.h + 20);
    
    // Show value
    textSize(12);
    text(floor(s.value), s.x + 10, s.y + s.h + 40);
    
    // FX selection checkbox
    let checkX = s.x + 5;
    let checkY = s.y + s.h + 50;
    
    // Draw checkbox
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(checkX, checkY, 15, 15);
    
    // Draw checkmark if selected
    if (selectedChannels[i]) {
      fill(0, 200, 0);
      noStroke();
      rect(checkX + 3, checkY + 3, 9, 9);
    }
    
    // Label
    fill(0);
    noStroke();
    textSize(10);
    text("FX", checkX + 20, checkY + 11);
    
    textSize(16);
  });
}

// ----------------- Master and Group Controls -----------------
function drawMasterAndGroups() {
  // Master Controls Box
  fill(220);
  rect(50, 410, 250, 180, 10);
  
  fill(0);
  textSize(18);
  text("MASTER CONTROLS", 90, 440);
  
  // Grand Master Fader
  textSize(14);
  text("Grand Master", 70, 475);
  grandMaster = sliderBar(70, 485, 200, grandMaster);
  text(`${floor(grandMaster * 100)}%`, 280, 495);
  
  // Blackout Button
  let blackoutColor = blackoutActive ? color(255, 50, 50) : color(255);
  fill(blackoutColor);
  stroke(0);
  strokeWeight(2);
  rect(70, 520, 200, 50, 5);
  
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text(blackoutActive ? "● BLACKOUT ACTIVE" : "BLACKOUT", 170, 545);
  textAlign(LEFT, BASELINE);
  
  // Group Controls Box
  fill(210);
  rect(320, 410, 250, 180, 10);
  
  fill(0);
  textSize(18);
  text("GROUP CONTROLS", 360, 440);
  
  textSize(12);
  groups.forEach((group, i) => {
    let y = 465 + i * 35;
    
    // Group checkbox
    let checkX = 340;
    let checkY = y;
    
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(checkX, checkY, 15, 15);
    
    if (group.enabled) {
      fill(0, 150, 255);
      noStroke();
      rect(checkX + 3, checkY + 3, 9, 9);
    }
    
    // Group label
    fill(0);
    noStroke();
    text(`${group.name} (CH ${group.channels.map(c => c + 1).join(", ")})`, checkX + 25, checkY + 11);
    
    // Flash button
    let btnX = 490;
    let btnY = checkY - 5;
    fill(200);
    rect(btnX, btnY, 55, 20, 3);
    fill(0);
    textAlign(CENTER, CENTER);
    text("Flash", btnX + 27, btnY + 10);
    textAlign(LEFT, BASELINE);
  });
}

function drawFXPanel() {
  fill(230);
  rect(600, 80, 270, 510, 10);

  fill(0);
  textSize(18);
  text("EFFECTS", 680, 110);

  // Dropdown
  textSize(14);
  fill(255);
  rect(620, 140, 200, 30, 5);
  fill(0);
  text(`Effect: ${effectType}`, 630, 160);

  if (dropdownOpen) {
    fill(255);
    rect(620, 170, 200, fxOptions.length * 30, 5);
    fxOptions.forEach((opt, i) => {
      fill(0);
      text(opt, 630, 190 + i * 30);
    });
  }

  // Speed & Intensity sliders
  fill(0);
  text("Speed", 620, 250);
  effectSpeed = sliderBar(620, 260, 200, effectSpeed);
  text(`${floor(effectSpeed * 100)}%`, 835, 270);
  
  text("Intensity", 620, 320);
  effectIntensity = sliderBar(620, 330, 200, effectIntensity);
  text(`${floor(effectIntensity * 100)}%`, 835, 340);

  // Channel selection buttons
  fill(0);
  textSize(14);
  text("Apply FX to:", 620, 390);
  
  drawButton(620, 400, 90, 30, "All Channels", () => {
    selectedChannels = Array(8).fill(true);
  });
  drawButton(730, 400, 90, 30, "Clear All", () => {
    selectedChannels = Array(8).fill(false);
  });

  // Enable/Disable FX buttons
  drawButton(620, 450, 90, 35, "Enable FX", () => effectEnabled = true);
  drawButton(730, 450, 90, 35, "Disable FX", () => effectEnabled = false);
  
  // FX status
  textSize(12);
  fill(effectEnabled ? color(0, 200, 0) : color(200, 0, 0));
  text(effectEnabled ? "FX ACTIVE" : "FX OFF", 670, 510);
  
  // Show selected channels
  textSize(10);
  fill(0);
  let selectedList = [];
  for (let i = 0; i < 8; i++) {
    if (selectedChannels[i]) selectedList.push(i + 1);
  }
  text("Selected: " + (selectedList.length > 0 ? selectedList.join(", ") : "None"), 620, 530);
  
  // Info text
  textSize(9);
  fill(100);
  text("Use FX checkboxes below faders", 620, 560);
  text("to select channels", 620, 575);
}

// ----------------- FX Engine -----------------
function applyFX() {
  let t = millis() / 1000;
  sliders.forEach((s, i) => {
    // Only apply FX to selected channels
    if (!selectedChannels[i]) return;
    
    if (effectType === "Pulse") {
      s.value = map(sin(t * 2 * effectSpeed * PI), -1, 1, 0, effectIntensity * 255);
    } else if (effectType === "Chase") {
      let phase = i * 0.5;
      s.value = map(sin(t * effectSpeed * PI + phase), -1, 1, 0, effectIntensity * 255);
    }
  });
}

// ----------------- Mouse -----------------
function mousePressed() {
  // Blackout button
  if (mouseX > 70 && mouseX < 270 && mouseY > 520 && mouseY < 570) {
    blackoutActive = !blackoutActive;
    return;
  }
  
  // Group checkboxes
  groups.forEach((group, i) => {
    let checkX = 340;
    let checkY = 465 + i * 35;
    
    if (mouseX > checkX && mouseX < checkX + 15 &&
        mouseY > checkY && mouseY < checkY + 15) {
      group.enabled = !group.enabled;
      return;
    }
  });
  
  // Dropdown toggle
  if (mouseX > 620 && mouseX < 820 && mouseY > 140 && mouseY < 170) {
    dropdownOpen = !dropdownOpen;
    return;
  }
  
  // Dropdown options
  if (dropdownOpen) {
    for (let i = 0; i < fxOptions.length; i++) {
      if (mouseX > 620 && mouseX < 820 &&
          mouseY > 170 + i * 30 &&
          mouseY < 200 + i * 30) {
        effectType = fxOptions[i];
        dropdownOpen = false;
        return;
      }
    }
  }
  
  // Channel FX checkboxes
  sliders.forEach((s, i) => {
    let checkX = s.x + 5;
    let checkY = s.y + s.h + 50;
    
    if (mouseX > checkX && mouseX < checkX + 15 &&
        mouseY > checkY && mouseY < checkY + 15) {
      selectedChannels[i] = !selectedChannels[i];
    }
  });
}

// Handle flash buttons (hold to flash group)
function mouseReleased() {
  // Reset any flashing groups
  groups.forEach(group => {
    group.flashing = false;
  });
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
    if (!effectEnabled && mouseIsPressed &&
        mouseX > this.x && mouseX < this.x + 40 &&
        mouseY > this.y && mouseY < this.y + this.h) {
      let pct = 1 - (mouseY - this.y) / this.h;
      let oldValue = this.value;
      this.value = constrain(pct * 255, 0, 255);
      
      // Debug: Show when value changes
      if (abs(oldValue - this.value) > 5) {
        console.log(`Slider updated: ${floor(this.value)}`);
      }
    }
  }

  display() {
    fill(200);
    rect(this.x, this.y, 40, this.h, 3);
    
    // Apply grand master and blackout
    let finalValue = this.value;
    if (blackoutActive) {
      finalValue = 0;
    } else {
      finalValue = this.value * grandMaster;
    }
    
    fill(100, 150, 255);
    let hFill = map(finalValue, 0, 255, 0, this.h);
    rect(this.x, this.y + this.h - hFill, 40, hFill, 3);
    
    // Add border
    noFill();
    stroke(0);
    strokeWeight(2);
    rect(this.x, this.y, 40, this.h, 3);
    noStroke();
  }

  getFinalValue() {
    if (blackoutActive) return 0;
    return floor(this.value * grandMaster);
  }
}

// ----------------- Utility -----------------
function sliderBar(x, y, w, val) {
  fill(200);
  rect(x, y, w, 10, 5);

  let knobX = x + val * w;
  fill(100);
  ellipse(knobX, y + 5, 15);

  if (mouseIsPressed && dist(mouseX, mouseY, knobX, y + 5) < 15) {
    val = constrain((mouseX - x) / w, 0, 1);
  }
  return val;
}

function drawButton(x, y, w, h, label, callback) {
  let hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  
  fill(hover ? 230 : 255);
  rect(x, y, w, h, 5);
  fill(0);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(label, x + w/2, y + h/2);
  textAlign(LEFT, BASELINE);
  
  if (mouseIsPressed && hover) {
    callback();
  }
}

// ----------------- WebSerial -----------------
async function connectSerial() {
  if ("serial" in navigator) {
    try {
      
      port = await navigator.serial.requestPort();
      
      console.log("Port selected, attempting to open...");
      
      
      await port.open({ 
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none"
      });
      
      console.log("Port opened successfully!");
      isConnected = true;
      
      // Get writable stream
      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
      writer = textEncoder.writable.getWriter();
      
      console.log("✅ Connected to ESP32!");
      alert("✅ Connected successfully!");
      
      
      readFromSerial();
      
    } catch (err) {
      console.error("❌ Serial connection failed:", err);
      
      let errorMsg = "Connection failed!\n\n";
      
      if (err.message.includes("Failed to open")) {
        errorMsg += "The port is already in use.\n\n";
        errorMsg += "Solutions:\n";
        errorMsg += "1. Close Arduino IDE Serial Monitor\n";
        errorMsg += "2. Close any other programs using the port\n";
        errorMsg += "3. Unplug and replug your ESP32\n";
        errorMsg += "4. Refresh this page and try again";
      } else {
        errorMsg += err.message;
      }
      
      alert(errorMsg);
      isConnected = false;
    }
  } else {
    alert("⚠️ Web Serial API not supported. Use Chrome or Edge browser.");
  }
}

async function readFromSerial() {
  try {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();
    
    // Read loop
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }
      if (value) {
        console.log("ESP32:", value);
      }
    }
  } catch (err) {
    console.error("Read error:", err);
  }
}

async function sendToArduino() {
  if (!writer || !isConnected) return;
  
  // Apply group controls and get final values
  let finalValues = sliders.map((s, i) => {
    let value = s.getFinalValue();
    
    // Check if channel is in a disabled group
    for (let group of groups) {
      if (group.channels.includes(i) && !group.enabled) {
        value = 0;
      }
    }
    
    // Check if flash button is pressed for this channel's group
    for (let g = 0; g < groups.length; g++) {
      let group = groups[g];
      let btnX = 490;
      let btnY = 460 + g * 35;
      
      if (mouseIsPressed && 
          mouseX > btnX && mouseX < btnX + 55 &&
          mouseY > btnY && mouseY < btnY + 20 &&
          group.channels.includes(i)) {
        value = 255; // Full brightness when flashing
      }
    }
    
    return value;
  });
  
  // Format: CH1,CH2,CH3,CH4,CH5,CH6,CH7,CH8
  let data = finalValues.join(",") + "\n";
  
  try {
    await writer.write(data);
    
    if (frameCount % 60 === 0) {
      console.log("📤 Sending to ESP32:", data.trim());
    }
  } catch (err) {
    console.error("❌ Send failed:", err);
    isConnected = false;
  }
}

// Cleanup on page unload
window.addEventListener('beforeunload', async () => {
  if (writer) {
    await writer.close();
  }
  if (port) {
    await port.close();
  }
});
