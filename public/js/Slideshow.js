import { StepController, StepAction } from './input/StepController.js';

const SLIDESHOW_DIV = document.getElementById('slideshow');
const SLIDESHOW_IMG_DIV = document.getElementById('slideshowImg');
const SLIDESHOW_CAPTION_DIV = document.getElementById('slideshowCaption');
const SLIDESHOW_COUNTER_DIV = document.getElementById('slideshowCounter');

/** Represents a slideshow modal/overlay that accepts a game controller to navigate */
export class Slideshow {
  
  constructor(slides, onClose) {
    this.slides = slides;
    this.onClose = onClose;

    this.lastGamepad = { buttons: [], axes: [] };
    this.stepController = new StepController(this.handleControllerChange.bind(this));
    this.curSlide = 0;
    this.images = [];
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
    SLIDESHOW_CAPTION_DIV.innerHTML = this.slides[this.curSlide].caption;
    SLIDESHOW_COUNTER_DIV.innerHTML = `${(this.curSlide + 1)} of ${this.slides.length}`;
    SLIDESHOW_IMG_DIV.src = this.images[this.curSlide].src;
  }

  nextSlide() {
    this.curSlide++;
    if (this.curSlide >= this.slides.length) {
      this.curSlide = 0;
    }
    this.loadSlide();
  }

  previousSlide() {
    this.curSlide--;
    if (this.curSlide < 0) {
      this.curSlide = this.slides.length - 1;
    }
    this.loadSlide();
  }

  preloadImages() {
    for (let i = 0; i < this.slides.length; i++) {
      this.images[i] = new Image();
      this.images[i].src = this.slides[i].uri;
    }
  }

  cleanup() {
    this.stepController.cleanup();
    this.stepController = null;
    SLIDESHOW_DIV.classList.add('hidden');
    this.onClose();
  }

  init() {
    this.preloadImages()
    this.stepController.init();
    this.loadSlide();
    SLIDESHOW_DIV.classList.remove('hidden');
  }
}