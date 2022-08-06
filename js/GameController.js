import { numberArraysMatch } from './utils.js';

// Every gamepad is different. Let's start with the donated rock candy controller.
// TODO: How will we best support other controllers in the future? 
export const GamepadRockCandy = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  BACK: 8,
  START: 9,
  THUMBL: 10,
  THUMBR: 11,
  DPADU: 12,
  DPADD: 13,
  DPADL: 14,
  DPADR: 15,
  // 16 would be the logo button, yet not picking up on this event for specific controller
};

/** 
 * Represents the game controller that interacts with the app.
 * Thanks: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 * */
export class GameController {
  /**
   * Create the game controller.
   * @param {function} onButtonChange - Callback for when button states change
   * @param {function} onAxesChange - Callback for when thumbstick states change
   */
  constructor(
    onButtonChange = (buttonIndexArray) => {},
    onAxesChange = (axesArray) => {},
  ) {
    this.onButtonChange = onButtonChange;
    this.onAxesChange = onAxesChange;

    this.controllers = [];
    this.oldButtons = [];
    this.oldAxes = [];
    this.scanGamepadsTimer;
  }

  init() {    
    this.addEventListeners();
    this.scanGamepadsTimer = setInterval(this.scanGamepads.bind(this), 500);
  }

  cleanup() {
    this.removeEventListeners();
    clearInterval(this.scanGamepadsTimer);
  }

  scanGamepads() {
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
      if (gamepad) { // Can be null if disconnected during the session
        if (gamepad.index in this.controllers) {
          this.controllers[gamepad.index] = gamepad;
        } else {
          this.addGamepad(gamepad);
        }
      }
    }
  }

  reduceToActiveButtons(buttons) {
    return buttons.reduce((combined, button, curIndex) => {
      if (button === 1.0 || (typeof button === 'object' && button.pressed)) {
        return [curIndex, ...combined];
      }
      return combined;
    }, []);
  }

  statusLoop() {
    let message = '';

    if (!this.controllers) {
      requestAnimationFrame(this.statusLoop.bind(this));
      return;
    }

    for (const j in this.controllers) {
      const controller = this.controllers[j];
      const activeButtons = this.reduceToActiveButtons(controller.buttons);

      if (!numberArraysMatch(activeButtons, this.oldButtons)) {
        this.oldButtons = activeButtons;
        this.onButtonChange(activeButtons);
      }

      if (!numberArraysMatch(controller.axes, this.oldAxes)) {
        this.oldAxes = controller.axes;
        this.onAxesChange(controller.axes);
      }
    }

    requestAnimationFrame(this.statusLoop.bind(this));
  }

  addGamepad(gamepad) {
    this.controllers[gamepad.index] = gamepad;
  }

  removeGamePad(gamepad) {
    delete this.controllers[gamepad.index];
  }

  handleConnect(e) {
    this.addGamepad(e.gamepad);
    requestAnimationFrame(this.statusLoop.bind(this));
    this.setDebugMessage(`Gamepad connected! index: ${e.gamepad.index}, id: ${e.gamepad.id}, button count: ${e.gamepad.buttons.length}, axes count: ${e.gamepad.axes.length}`);
  }

  handleDisconnect(e) {
    this.removeGamepad(e.gamepad);
    this.setDebugMessage(`Gamepad disconnected. index: ${e.gamepad.index}, id: ${e.gamepad.id}`);
  }

  addEventListeners() {
    window.addEventListener('gamepadconnected', this.handleConnect);
    window.addEventListener('gamepaddisconnected', this.handleDisconnect);
  }

  removeEventListeners() {
    window.removeEventListener('gamepadconnected', this.handleConnect);
    window.removeEventListener('gamepaddisconnected', this.handleDisconnect);
  }

}
