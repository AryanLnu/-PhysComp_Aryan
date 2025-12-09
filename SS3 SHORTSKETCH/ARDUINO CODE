// Pin connected to your analog sensor (potentiometer, LDR, etc.)
const int sensorPin = 1;  // Changed to GPIO 1

void setup() {
  Serial.begin(9600); // Must match baudRate in p5.js
}

void loop() {
  int sensorValue = analogRead(sensorPin);  // Read analog sensor (0-4095 on ESP32-S3)
  
  // Map to 0-1023 to match p5.js expectations
  int mappedValue = map(sensorValue, 0, 4095, 0, 1023);

  Serial.println(mappedValue); // Send value over Serial
  delay(50);                   // Small delay for stability (~20Hz updates)
}

