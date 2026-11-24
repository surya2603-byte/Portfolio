
/* ===== WAVES: electric light waves at the bottom of the hero section =====
   Thin blue lines spread out on the left, narrow toward the center, then
   rise toward the globe stand, following the reference image. The lines
   flow slowly, while glowing particles (small comets) travel along them
   like electric currents. Rendered on <canvas id="waves">. */

(function () {
  var canvas = document.getElementById("waves");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== SETTINGS (edit here) =====
  var LINES = 38;          // number of lines in the wave band
  var FLOW = 0.00045;      // wave flow speed
  var SPARKS = 14;         // number of moving light particles
  var SPARK_SPEED = 0.00011;

  var W = 0, H = 0;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Wave band width: wide on the left, narrow around 30% of the screen, then wider on the right
  function spread(x) {
    var n = x / W;
    return H * (0.05
      + 0.34 * Math.exp(-Math.pow(n / 0.26, 2))
      + 0.11 * Math.exp(-Math.pow((n - 0.78) / 0.20, 2)));
  }

  // Wave band centerline: slopes downward from the left, then gradually rises toward the right
  function center(x, t) {
    var n = x / W;
    return H * (0.70 - 0.22 * Math.exp(-Math.pow(n / 0.30, 2)) - 0.14 * Math.max(0, n - 0.35))
      + H * 0.045 * Math.sin(n * 6.4 - t * 0.0011);
  }

  function lineY(x, j, t) {
    var u = (j / (LINES - 1)) * 2 - 1;                       // -1 to 1
    var breathe = 1 + 0.07 * Math.sin(t * 0.0009 + j * 0.35);
    var twist = H * 0.012 * Math.sin(x * 0.011 + j * 0.65 + t * 0.0014);
    return center(x, t) + u * spread(x) * breathe + twist;
  }

  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineJoin = "round";

    var step = Math.max(6, Math.round(W / 220));

    // 1) Wave band lines
    for (var j = 0; j < LINES; j++) {
      var u = Math.abs((j / (LINES - 1)) * 2 - 1);
      var alpha = 0.10 + 0.26 * (1 - u);                      // center lines are brighter
      ctx.strokeStyle = "rgba(45,140,255," + alpha.toFixed(3) + ")";
      ctx.lineWidth = j % 7 === 0 ? 1.4 : 0.8;
      ctx.beginPath();
      for (var x = -10; x <= W + 10; x += step) {
        var y = lineY(x, j, t);
        if (x === -10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 2) Moving light particles traveling along the lines (electric currents)
    for (var s = 0; s < SPARKS; s++) {
      var line = Math.round(((s * 7 + 3) % LINES));
      var prog = ((t * SPARK_SPEED * (0.8 + (s % 5) * 0.12)) + s / SPARKS) % 1;
      var hx = prog * (W + 160) - 80;

      for (var i = 14; i >= 0; i--) {
        var x0 = hx - i * 9;
        var x1 = hx - (i + 1) * 9;
        var a = (1 - i / 14) * 0.9;
        ctx.strokeStyle = "rgba(110,215,255," + a.toFixed(3) + ")";
        ctx.lineWidth = 0.7 + 1.9 * (1 - i / 14);
        ctx.beginPath();
        ctx.moveTo(x0, lineY(x0, line, t));
        ctx.lineTo(x1, lineY(x1, line, t));
        ctx.stroke();
      }

      ctx.save();
      ctx.shadowColor = "rgba(100,220,255,1)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "rgba(235,250,255,1)";
      ctx.beginPath();
      ctx.arc(hx, lineY(hx, line, t), 2.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.globalCompositeOperation = "source-over";
  }

  var running = false;
  var visible = true;

  function loop(time) {
    if (!running) return;
    frame(time * FLOW / 0.00045);                              // FLOW controls the animation time scale
    window.requestAnimationFrame(loop);
  }

  function start() {
    if (reduce || running || !visible) return;
    running = true;
    window.requestAnimationFrame(loop);
  }

  function stop() { running = false; }

  resize();
  frame(2200);
  start();

  window.addEventListener("resize", function () {
    resize();
    frame(2200);
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }).observe(canvas);
  }
})();
