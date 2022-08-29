import { StepController, StepAction } from './input/StepController.js';
import { UiSound, Sounds } from './UiSound.js';

const SLIDESHOW_DIV = document.getElementById('slideshow');
const SLIDESHOW_IMG_DIV = document.getElementById('slideshowImg');
const SLIDESHOW_CAPTION_DIV = document.getElementById('slideshowCaption');
const SLIDESHOW_COUNTER_DIV = document.getElementById('slideshowCounter');
const SLIDESHOW_RIGHT_DIV = document.getElementById('slideshowRight');
const SLIDESHOW_LEFT_DIV = document.getElementById('slideshowLeft');
const SLIDESHOW_CLOSE_DIV = document.getElementById('slideshowClose');

/** Represents a slideshow modal/overlay that accepts a game controller to navigate */
export class Slideshow {
  
  constructor(slides,
    onClose,
    idleTimeoutMilliseconds = 60000,
  ) {
    this.slides = slides;
    this.onClose = onClose;
    this.idleTimeoutMilliseconds = idleTimeoutMilliseconds;

    this.idleTimeout = {}
    this.stepController = new StepController(this.handleControllerChange.bind(this));
    this.curSlide = 0;
    this.images = [];
    this.sound = {};
    this.previousClicked = this.previousMouseClickHandler.bind(this);
    this.nextClicked = this.nextMouseClickHandler.bind(this);
    this.closeClicked = this.closeMouseClickHandler.bind(this);
  }

  resetIdleTimeout() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    
    // End scene and move to something else like the the logo screensaver after idle too long
    this.idleTimeout = setTimeout(this.cleanup.bind(this), this.idleTimeoutMilliseconds);
  }

  handleControllerChange(action) {
    this.resetIdleTimeout();
    
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
    this.sound.play(Sounds.NEXT);
    this.curSlide++;
    if (this.curSlide >= this.slides.length) {
      this.curSlide = 0;
    }
    this.loadSlide();
  }

  previousSlide() {
    this.sound.play(Sounds.NEXT);
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

  nextMouseClickHandler() {
    this.nextSlide();
  }

  previousMouseClickHandler() {
    this.previousSlide();
  }

  closeMouseClickHandler() {
    this.cleanup();
  }

  addMouseEventListers() {
    SLIDESHOW_RIGHT_DIV.addEventListener('click', this.nextClicked);
    SLIDESHOW_LEFT_DIV.addEventListener('click', this.previousClicked);
    SLIDESHOW_CLOSE_DIV.addEventListener('click', this.closeClicked);
  }

  removeMouseEventListers() {
    SLIDESHOW_RIGHT_DIV.removeEventListener('click', this.nextClicked);
    SLIDESHOW_LEFT_DIV.removeEventListener('click', this.previousClicked);
    SLIDESHOW_CLOSE_DIV.removeEventListener('click', this.closeClicked);
  }

  cleanup() {
    this.sound.play(Sounds.CLOSE);
    this.removeMouseEventListers();
    this.stepController.cleanup();
    this.stepController = null;
    SLIDESHOW_DIV.classList.add('hidden');
    this.onClose();
  }

  init() {
    this.sound = new UiSound();
    this.preloadImages()
    this.stepController.init();
    this.loadSlide();
    this.addMouseEventListers();
    SLIDESHOW_DIV.classList.remove('hidden');
    this.resetIdleTimeout();
  }
}