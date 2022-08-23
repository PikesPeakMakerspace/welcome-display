#include <FastLED.h>

/***********************************************
 * Looking at 10 pin connector w/ power/LED connectors pointing left
 * 
 *       PORTF.4   PORTF.0   PORTF.0     N/C      PORTF.6   
 *          X         X         X         X          X
 *          
 *          
 *          X         X         X         X          X
 *       PORTF.5     GND       N/C       GND      PORTF.7
 *       
 *       
 *       PORTF[7:4] => 4 bit input code to tell Teensy what color to display. PORTF.0 is also routed
 *                     to the connector. It (as well as GND) are doubled up because of the way the 10 pin
 *                     connector connects to an arbitrary PCB board. The middle 3 pins on top and bottom
 *                     are all electrically connected
 *       
 *            PORTF [7654---0]
 *       black       0000
 *       printing    0001
 *       cnc         0010
 *       computers   0011
 *       dedicated   0100
 *       electronics 0101
 *       laser       0110
 *       metal       0111
 *       multiUse    1000  
 *       wood        1001
 *       avail       1010
 *       lightBlue   1011
 *       blue        1100
 *       orange      1101
 *       white       1110
 *       black       1111
 */
 
#define LED_PIN     5       // D0 (SCL/PWM/INTO)
#define NUM_LEDS    30
#define BRIGHTNESS  64
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
CRGB leds[NUM_LEDS];

#define UPDATES_PER_SECOND 100

CRGBPalette16 currentPalette;   // this can be modified to make animated light shows. For now, it's static
TBlendType    currentBlending;  // currently, just NOBLEND

void setup() {
  delay(2000);      // power-up safety delay

  // setup our input (high 4 bits on port F)
  DDRF = B00001110; // set high 4 bits + bit0 as input
  PORTF = 0xff;     // set high 4 bits + bit0 pullup on
  
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );   // setup our FastLED
  FastLED.setBrightness(BRIGHTNESS);   // set brightness
  
  SetupKioskPalette();  // configure our palette
}

// this is constantly looping
void loop()
{
  uint8_t pfVal = 0;            // temp var for PORTF
  
  pfVal = (PINF & 0xf0) >> 4;   // move high nibble to low nibble

  FillLEDsFromPaletteColors(pfVal*16);  // use whatever the PORTF[7:4] 4 bit value is as our offset to set our LEDs from palette
                                        // multiply by 16 to get true colors we set in palette
  
  FastLED.show();     // update LED strand
  FastLED.delay(250); // delay 250ms. FastLed.delay() delays while also refreshing LED strand
}

// Fills all the LED values from whatever index in our palette
// Palette is a 256 byte entry. Every 16th entry is the true color we set below in SetupKioskPalette(). Entries in between
// (e.g. entry 8) are the smooth transition from one index's color to the next. We only care about the 16 colors.
// Assumes "colorIndex" is some # divisible by 16.
void FillLEDsFromPaletteColors(uint8_t colorIndex)
{
  uint8_t bness = 255;

  // loop for all LEDs and set its color according to colorIndex
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = ColorFromPalette(currentPalette, colorIndex, bness, currentBlending);
  }
}


// this function left over from example code. Might want to use at some point...
void ChangePalettePeriodically()
{
  uint8_t secondHand = (millis() / 1000) % 60;
  static uint8_t lastSecond = 99;
  
  if (lastSecond != secondHand) {
    lastSecond = secondHand;
    if (secondHand ==  0) {
      // do something
    }
  }
}

// This configures our currentPalette for our specific colors
void SetupKioskPalette()
{
                      //   RED  GREEN  BLUE
  CRGB cnc =          CRGB(0x2b, 0x78, 0xbd);
  CRGB laser =        CRGB(0xbc, 0x1e, 0x2e);
  CRGB electronics =  CRGB(0x9e, 0x4d, 0xb2);
  CRGB computers =    CRGB(0xb3, 0xb7, 0x21);
  CRGB multiUse =     CRGB(0xb5, 0x96, 0x7f);
  CRGB dedicated =    CRGB(0x91, 0xac, 0xb5);
  CRGB metal =        CRGB(0xb5, 0x40, 0x7e);
  CRGB wood =         CRGB(0x42, 0xb5, 0x49);
  CRGB printing =     CRGB(0xb2, 0x76, 0x1f);
  CRGB lightBlue =    CRGB(0x89, 0xb2, 0xde);
  CRGB blue =         CRGB(0x1e, 0x41, 0x7d);
  CRGB orange =       CRGB(0xff, 0x67, 0x00);
  CRGB white =        CRGB(0xff, 0xff, 0xff);
  CRGB black  =       CRGB::Black;
  CRGB avail =        CRGB::Black;
  
  currentPalette = CRGBPalette16(
    black,        // 0000
    printing,     // 0001
    cnc,          // 0010
    computers,    // 0011
    dedicated,    // 0100
    electronics,  // 0101
    laser,        // 0110
    metal,        // 0111
    multiUse,     // 1000  
    wood,         // 1001
    avail,        // 1010
    lightBlue,    // 1011
    blue,         // 1100
    orange,       // 1101
    white,        // 1110
    black         // 1111
  );
  currentBlending = NOBLEND;
}
