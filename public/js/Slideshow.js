import { StepController, StepAction } from './input/StepController.js';

const SLIDESHOW_DIV = document.getElementById('slideshow');

/** Represents a slideshow modal/overlay that accepts a game controller to navigate */
export class Slideshow {
  
  constructor(images, onClose) {
    this.images = images;
    this.onClose = onClose;

    this.lastGamepad = { buttons: [], axes: [] };
    this.stepController = new StepController(this.handleControllerChange.bind(this));
  }

  handleControllerChange(action) {
    // accept select/deselect buttons to exit slideshow for now
    if (action === StepAction.SELECT || action === StepAction.DISMISS) {
      this.cleanup();
      return;
    }
  }

  cleanup() {
    this.stepController.cleanup();
    this.stepController = null;
    SLIDESHOW_DIV.classList.add('hidden');
    this.onClose();
  }

  init() {
    this.stepController.init();
    SLIDESHOW_DIV.classList.remove('hidden');
  }
}