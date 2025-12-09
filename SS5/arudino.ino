const int ledPin = 13; 
int mode = 0;          

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  
  if (Serial.available() > 0) {
    char cmd = Serial.read();

    if (cmd == '0') mode = 0; // LED off
    if (cmd == '1') mode = 1; // LED blink
  }

 
  if (mode == 0) {
    digitalWrite(ledPin, LOW);
  } else if (mode == 1) {
    digitalWrite(ledPin, HIGH);
    delay(250);
    digitalWrite(ledPin, LOW);
    delay(250);
  }
}
