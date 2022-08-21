import { StepController, StepAction } from './input/StepController.js';

const SLIDESHOW_DIV = document.getElementById('slideshow');
const SLIDESHOW_IMG_DIV = document.getElementById('slideshowImg');
const SLIDESHOW_CAPTION_DIV = document.getElementById('slideshowCaption');
const SLIDESHOW_COUNTER_DIV = document.getElementById('slideshowCounter');

/** Represents a slideshow modal/overlay that accepts a game controller to navigate */
export class Slideshow {
  
  constructor(images, onClose) {
    this.images = images;
    this.onClose = onClose;

    this.lastGamepad = { buttons: [], axes: [] };
    this.stepController = new StepController(this.handleControllerChange.bind(this));
    this.curSlide = 0;
  }

  handleControllerChange(action) {
    // accept select/deselect buttons to exit slideshow for now
    if (action === StepAction.SELECT || action === StepAction.DISMISS) {
      this.cleanup();
      return;
    }

    if (action === StepAction.RIGHT) {
      this.nextSlide();
      return;
    }

    if (action === StepAction.LEFT) {
      this.previousSlide();
      return;
    }
  }

  loadSlide() {
    SLIDESHOW_IMG_DIV.src = this.images[this.curSlide].uri;
    SLIDESHOW_CAPTION_DIV.innerHTML = this.images[this.curSlide].caption;
    SLIDESHOW_COUNTER_DIV.innerHTML = `${(this.curSlide + 1)} of ${this.images.length}`;
  }

  nextSlide() {
    this.curSlide++;
    if (this.curSlide >= this.images.length) {
      this.curSlide = 0;
    }
    this.loadSlide();
  }

  previousSlide() {
    this.curSlide--;
    if (this.curSlide < 0) {
      this.curSlide = this.images.length - 1;
    }
    this.loadSlide();
  }

  cleanup() {
    this.stepController.cleanup();
    this.stepController = null;
    SLIDESHOW_DIV.classList.add('hidden');
    this.onClose();
  }

  init() {
    this.stepController.init();
    this.loadSlide();
    SLIDESHOW_DIV.classList.remove('hidden');
  }
}