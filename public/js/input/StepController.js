import { GameController, GamepadRockCandy as Gamepad } from '../input/GameController.js';
import { KeyboardController } from '../input/KeyboardController.js';

/**
 * Combine the game controller and keyboard controller to make 'step' callbacks.
 * 
 * Example 1: In the map, we want to move from one area to the next when pressing
 * of of few 'right' controls (dpad right, left thumbstick right, right thumbstick
 * right, R1, R2, keyboard right arrow, etc.). We'll consolidate all of
 * those as 'right'. Then, we only want to move one STEP when holding down a
 * 'right' button, unlike in Mario Brothers where you just keep moving right.
 * Letting go and pressing right again will move to the next map area to the right.
 * 
 * Example 2: In a slideshow, we want similar step movements. We don't want to
 * rapidly fly through all the sides by holding down a right button. Instead,
 * we'll press and/or hold down right to move to the next slide, release, then
 * press again to move to the next slide.
 */

// Names of effective button actions for the map and its slideshows
export const StepAction = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
  SELECT: 'select',
  DISMISS: 'dismiss'
}

// map actions with reported gamepad indices
const STEP_ACTION_BUTTON_MAP = {
  [StepAction.LEFT]: [Gamepad.DPADL, Gamepad.LB, Gamepad.LT],
  [StepAction.RIGHT]: [Gamepad.DPADR, Gamepad.RB, Gamepad.RT],
  [StepAction.UP]: [Gamepad.DPADU],
  [StepAction.DOWN]: [Gamepad.DPADD],
  [StepAction.DISMISS]: [Gamepad.A, Gamepad.X, Gamepad.START, Gamepad.THUMBR],
  [StepAction.SELECT]: [Gamepad.B, Gamepad.Y, Gamepad.BACK, Gamepad.THUMBL],
}

export class StepController {
  constructor(onStepAction) {
    this.onStepAction = onStepAction;
    
    this.gameControllers = [
      new GameController(this.handleControllerChange.bind(this)),
      new KeyboardController(this.handleControllerChange.bind(this)),
    ];
    this.lastGamepad = { buttons: [], axes: [] };
  }

  /**
  * Multiple buttons can result in the same action. Reduce that here.
  */
  getGamepadAction (gamepadButtonIndex) {
    for (const action in STEP_ACTION_BUTTON_MAP) {
      if (STEP_ACTION_BUTTON_MAP[action].includes(gamepadButtonIndex)) {
        return action;
      }
    }
    console.log(`gamepad index of ${gamepadButtonIndex} doesn't have a valid action assigned`);
    return;
  }

  /**
   * When pressing multiple buttons at the same time, example: down+right, and letting
   * one of those go like down, reduce duplicates so not to to trigger right button again.
   */
  cancelExistingButtons(activeButtons, lastButtons) {
    return activeButtons.filter(button => {
      return !lastButtons.includes(button);
    });
  }

  /**
   * Handle normalized game controller changes (KeyboardController is also
   * outputting matching GameController events)
   */
  handleControllerChange(gamepad) {
    let action;
    const reducedButtons = this.cancelExistingButtons(gamepad.buttons, this.lastGamepad.buttons);

    if (reducedButtons.length > 0) {
      for (const button of reducedButtons) {
        action = this.getGamepadAction(button);
        this.onStepAction(action);
      }
    }

    this.lastGamepad = gamepad;
  }

  init() {
    for(const controller of this.gameControllers) {
      controller.init();
    }
  }

  cleanup() {
    for(const index in this.gameControllers) {
      this.gameControllers[index].cleanup();
      this.gameControllers[index] = null;
    }
  }
}