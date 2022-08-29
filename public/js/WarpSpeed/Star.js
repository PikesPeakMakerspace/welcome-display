export class Star {

  constructor(
    canvasWidth,
    canvasHeight,
    warpSpeedAmt,
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.posX = Math.random() * this.canvasWidth;
    this.posY = Math.random() * this.canvasHeight;
    this.warpSpeedAmt = warpSpeedAmt;

    this.color = 0;
  }

  updatePos() {
    this.posX += (this.posX - (this.canvasWidth / 2)) * (this.warpSpeedAmt);
    this.posY += (this.posY - (this.canvasHeight / 2)) * (this.warpSpeedAmt);
    this.updateColor();
    
    if (this.posX > this.canvasWidth || this.posX < 0) {
      this.posX = Math.random() * this.canvasWidth;
      this.color = 0;
    }
    if (this.posY > this.canvasHeight || this.posY < 0) {
      this.posY = Math.random() * this.canvasHeight;
      this.color = 0;
    }
  }

  updateColor() {
    if (this.color < 255) {
      this.color += 5;
    }
    else {
      this.color = 255;
    }
  }

}
