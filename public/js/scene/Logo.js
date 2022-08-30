import { Scene } from './Scene.js';
import { StepController } from '../input/StepController.js';
import { WarpSpeed } from '../WarpSpeed/WarpSpeed.js';

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

    this.stepController = new StepController(this.handleControllerChange.bind(this), false);
    this.warpSpeed;
  }

  cleanup() {
    this.stepController.cleanup();
    this.stepController = null;
    this.warpSpeed.cleanup();

    LOGO_DIV.classList.add('hidden');
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
    this.warpSpeed = new WarpSpeed();
    this.warpSpeed.init();
    LOGO_DIV.classList.remove('hidden');
  }
}