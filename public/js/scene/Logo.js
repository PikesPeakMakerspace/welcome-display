import { Scene } from './Scene.js';
import { GameController } from '../GameController.js';
import { KeyboardController } from '../KeyboardController.js';

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

    this.gameControllers = [
      new GameController(this.handleControllerChange.bind(this)),
      new KeyboardController(this.handleControllerChange.bind(this)),
    ];
  }

  cleanup() {
    for(const index in this.gameControllers) {
      this.gameControllers[index].cleanup();
      this.gameControllers[index] = null;
    }

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
    for(const controller of this.gameControllers) {
      controller.init();
    }

    LOGO_DIV.classList.remove('hidden');
    // TODO: Make a nicer particle effect thing that's not copied from Code Pen:
    window.animateBackground = true;
  }
}