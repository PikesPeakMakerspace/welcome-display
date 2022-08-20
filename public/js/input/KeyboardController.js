import { numberArraysMatch } from '../utils.js';

// Map keyboard interactions to gamepad-like values for matching gamepad index readings
// Simplifying for purposes of this project.
export const GamepadKeyboard = {
  A: 0,
  B: 1,
  UP: 12,
  DOWN: 13,
  RIGHT: 15,
  LEFT: 14,
};

export const WatchedKeys = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  A: 'a',
  D: 'd',
}

/** 
 * Represents the keyboard game controller that interacts with the app.
 * */
export class KeyboardController {
  /**
   * Create the game controller.
   * @param {function} onButtonChange - Callback for when button states change
   */
  constructor(
    onControllerChange = (buttonsAndAxes) => { },
  ) {
    this.onControllerChange = onControllerChange;
    this.activeButtons = [];
    this.oldButtons = [];
    this.keyDownListener = {};
    this.keyUpListener = {};
  }

  init() {    
    this.addEventListeners();
  }

  cleanup() {
    this.removeEventListeners();
  }

  pressGamepadButton(button) {
    // merge button indices without duplicates
    this.activeButtons = [...new Set([...[button], ...this.activeButtons])];

    if (!numberArraysMatch(this.activeButtons, this.oldButtons)) {
      this.oldButtons = this.activeButtons;
      this.onControllerChange({ buttons: this.activeButtons, axes: [] });
    }
  }

  releaseGamepadButton(button) {
    this.activeButtons = this.activeButtons.filter(activeButton => activeButton !== button);
    if (!numberArraysMatch(this.activeButtons, this.oldButtons)) {
      this.oldButtons = this.activeButtons;
      this.onControllerChange({ buttons: this.activeButtons, axes: [] });
    }
  }

  handleKeyDown(e) {
    switch(e.key) {
      case WatchedKeys.ARROW_UP:
        this.pressGamepadButton(GamepadKeyboard.UP);
        break;
      case WatchedKeys.ARROW_DOWN:
        this.pressGamepadButton(GamepadKeyboard.DOWN);
        break;
      case WatchedKeys.ARROW_LEFT:
        this.pressGamepadButton(GamepadKeyboard.LEFT);
        break;
      case WatchedKeys.ARROW_RIGHT:
        this.pressGamepadButton(GamepadKeyboard.RIGHT);
        break;
      case WatchedKeys.A:
        this.pressGamepadButton(GamepadKeyboard.A);
        break;
      case WatchedKeys.D:
        // B gamepad button, D key on keyboard (AWSD directional thing)
        this.pressGamepadButton(GamepadKeyboard.B);
        break;
    }
  }

  handleKeyUp(e) {
    switch(e.key) {
      case WatchedKeys.ARROW_UP:
        this.releaseGamepadButton(GamepadKeyboard.UP);
        break;
      case WatchedKeys.ARROW_DOWN:
        this.releaseGamepadButton(GamepadKeyboard.DOWN);
        break;
      case WatchedKeys.ARROW_LEFT:
        this.releaseGamepadButton(GamepadKeyboard.LEFT);
        break;
      case WatchedKeys.ARROW_RIGHT:
        this.releaseGamepadButton(GamepadKeyboard.RIGHT);
        break;
      case WatchedKeys.A:
        this.releaseGamepadButton(GamepadKeyboard.A);
        break;
      case WatchedKeys.D:
        // B gamepad button, D key on keyboard (AWSD directional thing)
        this.releaseGamepadButton(GamepadKeyboard.B);
        break;
    }
  }

  addEventListeners() {
    this.keyDownListener = this.handleKeyDown.bind(this);
    this.keyUpListener = this.handleKeyUp.bind(this);
    window.addEventListener('keydown', this.keyDownListener);
    window.addEventListener('keyup', this.keyUpListener);
  }

  removeEventListeners() {
    window.removeEventListener('keydown', this.keyDownListener);
    window.removeEventListener('keyup', this.keyUpListener);
  }
}
