
const int buttonPin1 = 2;    // Digital button 1
const int buttonPin2 = 3;    // Digital button 2
const int potPin1    = 34;   // ADC-capable pin for potentiometer 1
const int potPin2    = 35;   // ADC-capable pin for potentiometer 2


int b1 = 0;
int b2 = 0;
int p1 = 0;
int p2 = 0;

// Timing
int lastSend = 0;            
const int sendInterval = 50;  // 20 Hz update

void setup() {
  Serial.begin(9600);           

  
  pinMode(buttonPin1, INPUT_PULLUP);
  pinMode(buttonPin2, INPUT_PULLUP);
}

void loop() {
  int now = millis();
  if (now - lastSend >= sendInterval) {
    lastSend = now;

    
    b1 = (digitalRead(buttonPin1) == LOW) ? 1 : 0;
    b2 = (digitalRead(buttonPin2) == LOW) ? 1 : 0;

    
    p1 = map(analogRead(potPin1), 0, 4095, 0, 255);
    p2 = map(analogRead(potPin2), 0, 4095, 0, 255);


    Serial.print(b1);
    Serial.print(",");
    Serial.print(b2);
    Serial.print(",");
    Serial.print(p1);
    Serial.print(",");
    Serial.println(p2);
  }
}
