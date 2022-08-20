import { Scene } from './Scene.js';
import { StepController, StepAction } from '../input/StepController.js';

const LOGO_DIV = document.getElementById('logoScene');

/**
 * Represents a logo "screen saver", waiting for initial user input to move
 * on to the next scene.
 */
export class Logo extends Scene {
  constructor(
   onSceneEnd = () => { },
  ) {
    super();
    this.onSceneEnd = onSceneEnd;

    this.stepController = new StepController(this.handleControllerChange.bind(this));
  }

  cleanup() {
    this.stepController.cleanup();
    this.stepController = null;

    LOGO_DIV.classList.add('hidden');

    window.animateBackground = false;
  }

  /**
   * End logo "screen saver"
   */
  handleControllerChange(buttons) {
    this.cleanup();
    this.endScene();
  }

  async init() {
    this.stepController.init();

    LOGO_DIV.classList.remove('hidden');
    // TODO: Make a nicer particle effect thing that's not copied from Code Pen:
    window.animateBackground = true;
  }
}