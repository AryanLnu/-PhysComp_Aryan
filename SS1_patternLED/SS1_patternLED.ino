const int LedPin1 = 4;
const int LedPin2 = 5;
const int LedPin3 = 6;
const int LedPin4 = 7;

int pattern = 0;
int ms= 1000;
int loopCount =0;



void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(LedPin1, OUTPUT);
  pinMode(LedPin2, OUTPUT);
  pinMode(LedPin3, OUTPUT);
  pinMode(LedPin4, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  if (pattern ==0 ){
    digitalWrite(LedPin1, HIGH);
    digitalWrite(LedPin2, HIGH);
    digitalWrite(LedPin3, HIGH);
    digitalWrite(LedPin4, HIGH);
    
  }
   else if (pattern == 1) {
    digitalWrite(LedPin1, LOW);
    digitalWrite(LedPin2, LOW);
    digitalWrite(LedPin3, LOW);
    digitalWrite(LedPin4, LOW);
    
  } 
  else if (pattern == 2) {
    digitalWrite(LedPin1, HIGH);
    digitalWrite(LedPin2, LOW);
    digitalWrite(LedPin3, LOW);
    digitalWrite(LedPin4, LOW);
   
  } 
  else if (pattern == 3) {
    digitalWrite(LedPin1, LOW);
    digitalWrite(LedPin2, HIGH);
    digitalWrite(LedPin3, LOW);
    digitalWrite(LedPin4, LOW);
    
  } 
  else if (pattern == 4) {
    digitalWrite(LedPin1, HIGH);
    digitalWrite(LedPin2, LOW);
    digitalWrite(LedPin3, HIGH);
    digitalWrite(LedPin4, LOW);
   
  } 
  else if (pattern == 5) {
    digitalWrite(LedPin1, LOW);
    digitalWrite(LedPin2, LOW);
    digitalWrite(LedPin3, LOW);
    digitalWrite(LedPin4, HIGH);
    
  }
  delay(ms);

  pattern++;
  if (pattern > 5){
    pattern = 0;
    loopCount++;
  }
  Serial.println(pattern);
  
}
