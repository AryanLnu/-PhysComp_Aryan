
const int LedPin1 = 4;
const int LedPin2 = 5;
const int LedPin3 = 6;
const int LedPin4 = 7;
const int ButtonPin = 8;  

int pattern = 0;
int loopCount = 0;
bool lastButtonState = HIGH;  

void setup() {
  Serial.begin(115200);

  pinMode(LedPin1, OUTPUT);
  pinMode(LedPin2, OUTPUT);
  pinMode(LedPin3, OUTPUT);
  pinMode(LedPin4, OUTPUT);
  pinMode(ButtonPin, INPUT_PULLUP); 

  Serial.println("ESP32-S3 LED Pattern Controller Started");
}

void loop() {
  bool buttonState = digitalRead(ButtonPin);


  if (lastButtonState == HIGH && buttonState == LOW) {
    pattern++;
    if (pattern > 5) {   
      pattern = 0;
      loopCount++;
    }

    Serial.print("Pattern: ");
    Serial.println(pattern);
    delay(200); 
  }

  lastButtonState = buttonState;

  
  switch (pattern) {
    case 0:  
      digitalWrite(LedPin1, HIGH);
      digitalWrite(LedPin2, HIGH);
      digitalWrite(LedPin3, HIGH);
      digitalWrite(LedPin4, HIGH);
      break;
    case 1:  
      digitalWrite(LedPin1, LOW);
      digitalWrite(LedPin2, LOW);
      digitalWrite(LedPin3, LOW);
      digitalWrite(LedPin4, LOW);
      break;
    case 2:
      digitalWrite(LedPin1, HIGH);
      digitalWrite(LedPin2, LOW);
      digitalWrite(LedPin3, LOW);
      digitalWrite(LedPin4, LOW);
      break;
    case 3:
      digitalWrite(LedPin1, LOW);
      digitalWrite(LedPin2, HIGH);
      digitalWrite(LedPin3, LOW);
      digitalWrite(LedPin4, LOW);
      break;
    case 4:
      digitalWrite(LedPin1, HIGH);
      digitalWrite(LedPin2, LOW);
      digitalWrite(LedPin3, HIGH);
      digitalWrite(LedPin4, LOW);
      break;
    case 5:
      digitalWrite(LedPin1, LOW);
      digitalWrite(LedPin2, LOW);
      digitalWrite(LedPin3, LOW);
      digitalWrite(LedPin4, HIGH);
      break;
  }
}
