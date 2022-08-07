import { Scene } from './Scene.js';
import { GameController } from '../GameController.js';
import { KeyboardController } from '../KeyboardController.js';

/**
 * Represents a the "travel" map of PPM, a slightly simplified map targeted towards
 * newcomers in a travel booth setting. Example: Someone who has never heard of PPM
 * may not care about where our bathroom or emergency exit is. They want to see the
 * giant laser that could* cut their kitchen table in half...
 */
export class TravelMap extends Scene {
  constructor(
   onSceneEnd = () => { },
   idleTimeoutMilliseconds = 120000,
  ) {
    super();
    this.onSceneEnd = onSceneEnd;
    this.idleTimeoutMilliseconds = idleTimeoutMilliseconds;

    this.gameControllers = [
      new GameController(this.handleButtonChange.bind(this), this.handleAxesChange.bind(this)),
      new KeyboardController(this.handleButtonChange.bind(this)),
    ];
    this.idleTimeout = {}
  }

  cleanup() {
    for(const index in this.gameControllers) {
      this.gameControllers[index].cleanup();
      this.gameControllers[index] = null;
    }
  }

  cleanupAndEnd() {
    this.cleanup();
    this.endScene();
  }

  resetIdleTimeout() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    
    // End scene and move to something else like the the logo screensaver after idle too long
    this.idleTimeout = setTimeout(this.cleanupAndEnd.bind(this), this.idleTimeoutMilliseconds);
  }

  handleButtonChange(buttons) {
    // TODO
    this.resetIdleTimeout();
    console.log(buttons);
  }
  
  handleAxesChange(axes) {
    // TODO
    this.resetIdleTimeout();
    console.log(axes);
  }

  init() {
    for(const controller of this.gameControllers) {
      controller.init();
    }

    this.resetIdleTimeout();
  }
}