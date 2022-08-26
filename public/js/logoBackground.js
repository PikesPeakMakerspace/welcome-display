// Thank you: Aaron Buchanan
// https://codepen.io/labdev/pen/NWzQKg

const LOGO_BACKGROUND = document.getElementById("logoBackground");

(() => {
  var DelaunayDataSet = function(vertex, context) {
      this.vertex = vertex;
      this.context = context;
    }

  var lights = [];
  var max_lights = 30;
  DelaunayDataSet.prototype.drawLight = function() {
    while (lights.length < max_lights) {
      var light = {
        x: Math.random() * this.context.canvas.width,
        y: Math.random() * this.context.canvas.height,
        angle: Math.random() * 360 * (Math.PI / 180),
        speed: Math.random() * 5
      }
      lights.push(light);
    }
    for (var i = 0; i < lights.length; i++) {
      var light = lights[i];
      light.x += Math.cos(light.angle) * light.speed;
      light.y += Math.sin(light.angle) * light.speed;
      if (light.x < 0 || light.y < 0 || light.x > this.context.canvas.width || light.y > this.context.canvas.height) {
        light.x = Math.random() * this.context.canvas.width;
        light.y = Math.random() * this.context.canvas.height;
        continue;
      }
      with(this.context) {
        fillStyle = "#FF6700";
        beginPath();
        arc(light.x, light.y, 3.5, 0, 2 * Math.PI, false);
        fill();
        closePath();
      }
    }
  };

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  (function() {
    let throttle = 0;

    var canvas = LOGO_BACKGROUND;
    var context = canvas.getContext("2d");

    var canvasWid = window.innerWidth / 3;
    var canvasHig = window.innerHeight / 3;

    canvas.width = canvasWid;
    canvas.height = canvasHig;

    var myDelaunayDataSet = new DelaunayDataSet([], context);

    function loop() {
      if (!window.animateBackground) {
        // requestAnimFrame(loop);
        return;
      }

      throttle++;
      if (throttle >= 3) {
        throttle = 0;
        context.clearRect(0, 0, canvasWid, canvasHig);
        myDelaunayDataSet.drawLight();
      }
      // requestAnimFrame(loop);
    }

    loop();

  })();

})();