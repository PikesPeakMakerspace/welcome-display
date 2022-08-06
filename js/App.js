import { GameController } from './GameController.js';
import { KeyboardController } from './KeyboardController.js';

const DEBUG_DIV = document.getElementById('debugMessages');

/**
 * The kiosk operates in a mode suited for traveling display
 * and for folks at at the makerspace who want more detailed info shown */
export const KioskMode = {
  TRAVEL: 'travel',
  MAKERSPACE: 'makerspace',
};

/** Represents the main app */
export class App {
  /**
   * Create the App.
   * @param {string} mode - Kiosk mode: see ModeTypes
   * @param {boolean} debug - Show debug logs
   */
  constructor(
    mode = KioskMode.TRAVEL,
    debug = false,
  ) {
    this.mode = mode;
    this.debug = debug;
    this.gameControllers = [];
  }

  handleButtonChange(buttons) {
    // TODO
    this.debugMessage(JSON.stringify(buttons));
  }

  handleAxesChange(axes) {
    // TODO
    this.debugMessage(JSON.stringify(axes));
  }

  showDebug() {
    if (this.debug) {
      DEBUG_DIV.classList.remove('hidden');
    }
  }

  debugMessage(message = 'message undefined') {
    if (this.debug) {
      console.log(message);
      DEBUG_DIV.innerHTML = message;
    }
  }

  init() {
    this.gameControllers = [
      new GameController(this.handleButtonChange.bind(this), this.handleAxesChange.bind(this)).init(),
      new KeyboardController(this.handleButtonChange.bind(this)).init(),
    ];

    this.showDebug();
  }

}