// Background warp: Thanks Art Carvajal!
// Based on: Warp Speed - a pen by Art Carvajal
// found at: http://codepen.io/acarva1/details/GgbgLe

import { Star } from './Star.js';

const BACKGROUND_CANVAS = document.getElementById('logoBackground');

export class WarpSpeed {

  constructor
  (
    warpSpeedAmt = 0.005,
    starCount = 50,
  ) {
    this.warpSpeedAmt = warpSpeedAmt;
    this.stars = [...Array(starCount)];

    this.canvas = BACKGROUND_CANVAS;
    this.canvas.width = window.innerWidth / 4;
    this.canvas.height = window.innerHeight / 4;
    this.ctx = this.canvas.getContext('2d');
    this.warpActive = false;
  }

  createStars() {
    const self = this;
    this.stars = this.stars.map(() => {
      return new Star(self.canvas.width, self.canvas.height, self.warpSpeedAmt);
    });
  }

  init() {
    this.createStars();
    this.warpActive = true;
    window.requestAnimationFrame(this.draw.bind(this));
  }

  cleanup() {
    this.warpActive = false;
    this.ctx.clearRect(0, 0, this.window.innerWidth, this.window.innerHeight);
  }

  draw() {
    if (!this.warpActive) {
      window.requestAnimationFrame(this.draw.bind(this));
      return;
    }

    this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (const star of this.stars) {
      this.ctx.fillStyle = 'rgb(255,105,0)';
      this.ctx.fillRect(star.posX, star.posY, star.color / 128, star.color / 128);
      star.updatePos();
    }
    
    window.requestAnimationFrame(this.draw.bind(this));
  }

}
