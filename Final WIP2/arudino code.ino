// ESP32-S3 Lighting Console Receiver
const int NUM_CHANNELS = 8;
int channelValues[NUM_CHANNELS] = {0};


const int ledPins[8] = {4, 5, 6, 7, 15, 16, 17, 18};

void setup() {
  Serial.begin(115200);
  
 
  for (int i = 0; i < NUM_CHANNELS; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
  
  Serial.println("ESP32-S3 Lighting Console Ready!");
  Serial.println("Waiting for data...");
}

void loop() {
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    
    
    Serial.print("Received: ");
    Serial.println(data);
    
    parseChannelData(data);
    updateOutputs();
  }
}

void parseChannelData(String data) {
  int channelIndex = 0;
  int startIndex = 0;
  
  for (int i = 0; i <= data.length(); i++) {
    if (data[i] == ',' || i == data.length()) {
      String value = data.substring(startIndex, i);
      if (channelIndex < NUM_CHANNELS) {
        channelValues[channelIndex] = value.toInt();
        channelIndex++;
      }
      startIndex = i + 1;
    }
  }
}

void updateOutputs() {

  for (int i = 0; i < NUM_CHANNELS; i++) {
    analogWrite(ledPins[i], channelValues[i]);
  }
  
  
  Serial.print("Channels: ");
  for (int i = 0; i < NUM_CHANNELS; i++) {
    Serial.print("CH");
    Serial.print(i + 1);
    Serial.print("=");
    Serial.print(channelValues[i]);
    Serial.print(" ");
  }
  Serial.println();
}
