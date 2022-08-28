import { numberArraysMatch } from '../utils.js';

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
   * @param {function} ignoreFirstButton - Prevent overly quick button pressing on init
   */
  constructor(
    onControllerChange = (buttonsAndAxes) => { },
    ignoreFirstButton = true,
  ) {
    this.onControllerChange = onControllerChange;
    this.ignoreFirstButton = ignoreFirstButton;

    this.controllers = [];
    this.oldButtons = [];
    this.oldAxes = [];
    this.scanGamepadsTimer = '';
    this.connectListener = {};
    this.disconnectListener = {};
    this.firstChange = false;
  }

  init() {    
    this.addEventListeners();
    this.scanGamepadsTimer = setInterval(this.scanGamepads.bind(this), 50);
    this.scanGamepads();
    this.statusLoop();
  }

  cleanup() {
    this.removeEventListeners();
    clearInterval(this.scanGamepadsTimer);
    for (const j in this.controllers) {
      this.removeGamePad(this.controllers[j]);
    }
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
    if (!this.controllers) {
      requestAnimationFrame(this.statusLoop.bind(this));
      return;
    }

    for (const j in this.controllers) {
      let change = false;
      const controller = this.controllers[j];
      const activeButtons = this.reduceToActiveButtons(controller.buttons);

      if (!numberArraysMatch(activeButtons, this.oldButtons)) {
        change = true;
        this.oldButtons = activeButtons;
      }

      // handle significant drifting values from axes
      const roundedAxes = controller.axes.map(axis => Math.round(axis * 10) / 10);

      if (!numberArraysMatch([...roundedAxes], [...this.oldAxes])) {
        change = true;
        this.oldAxes = roundedAxes;
      }

      if (change && this.ignoreFirstButton && !this.firstChange) {
        this.firstChange = true;
        requestAnimationFrame(this.statusLoop.bind(this));
        return;
      }

      if (change) {
        this.onControllerChange({ buttons: activeButtons, axes: roundedAxes });
      }
    }

    requestAnimationFrame(this.statusLoop.bind(this));
  }

  addGamepad(gamepad) {
    console.log('adding gamepad');
    this.controllers[gamepad.index] = gamepad;
  }

  removeGamePad(gamepad) {
    console.log('removing gamepad');
    delete this.controllers[gamepad.index];
  }

  handleConnect(e) {
    this.addGamepad(e.gamepad);
  }

  handleDisconnect(e) {
    this.removeGamepad(e.gamepad);
  }

  addEventListeners() {
    this.connectListener = this.handleConnect.bind(this);
    this.disconnectListener = this.handleDisconnect.bind(this);
    window.addEventListener('gamepadconnected', this.connectListener);
    window.addEventListener('gamepaddisconnected', this.disconnectListener);
  }

  removeEventListeners() {
    window.removeEventListener('gamepadconnected', this.connectListener);
    window.removeEventListener('gamepaddisconnected', this.disconnectListener);
  }

}
