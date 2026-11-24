
/* ===== HERO FX: animating the globe illustration =====
   The globe and its base (assets/hero-globe.png) are used as provided.
   This script adds animated effects on top:
   - icons (.orbit-icon) orbit around the globe, appearing larger in front and smaller behind
   - light ripples radiate from the base
   - particles rise from the base toward the globe
   - the signal line pulses like a heartbeat
   - a shimmer sweeps across the globe's surface
   - glowing comets travel along the orbital rings
   - small stars twinkle in the background
   All coordinates use the original image dimensions of 799 x 716, then scale to fit. */

(function () {
  var wrap = document.querySelector(".hero-visual");
  var canvas = document.getElementById("fx");
  if (!wrap || !canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== SETTINGS (edit here) =====
  var DW = 799, DH = 716;                       // original globe image dimensions
  var GLOBE = { x: 428, y: 302, r: 176 };       // globe position and radius in the image
  var PLATFORM = { x: 425, y: 582 };            // center of the base
  var HEART = { x: 418, y: 292 };               // center of the signal line inside the globe
  var RINGS = [                                 // icon orbit paths (aligned with the rings in the image)
    { cx: 392, cy: 325, a: 385, b: 58, rot: -0.2548, speed:  0.00026 },
    { cx: 418, cy: 138, a: 355, b: 52, rot: -0.1745, speed: -0.00020 }
  ];

  // ----- Icons -----
  var icons = Array.prototype.map.call(wrap.querySelectorAll(".orbit-icon"), function (el) {
    return {
      el: el,
      ring: Math.min(parseInt(el.getAttribute("data-ring"), 10) || 0, RINGS.length - 1),
      phase: parseFloat(el.getAttribute("data-phase")) || 0
    };
  });

  // ----- Stars and particles (fixed random values to keep them consistent across page reloads) -----
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  var stars = [];
  for (var s = 0; s < 34; s++) {
    stars.push({ x: rnd() * DW, y: rnd() * DH * 0.78, r: 0.6 + rnd() * 1.3, ph: rnd() * 6.28, sp: 0.0006 + rnd() * 0.0012 });
  }

  var parts = [];
  for (var p = 0; p < 46; p++) {
    parts.push({ dx: (rnd() - 0.5) * 240, t: rnd(), sp: 0.00008 + rnd() * 0.00009, r: 0.8 + rnd() * 1.4 });
  }

  var k = 1;      // scale factor from the original image to the screen
  var W = 0, H = 0;

  function resize() {
    var rect = wrap.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    k = W / DW;
    ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
  }

  function ringPoint(ring, a) {
    var lx = Math.cos(a) * ring.a;
    var ly = Math.sin(a) * ring.b;
    var c = Math.cos(ring.rot), sn = Math.sin(ring.rot);
    return { x: ring.cx + lx * c - ly * sn, y: ring.cy + lx * sn + ly * c, depth: Math.sin(a) };
  }

  // ----- Orbiting icons -----
  function placeIcons(time) {
    for (var i = 0; i < icons.length; i++) {
      var ic = icons[i];
      var ring = RINGS[ic.ring];
      var pt = ringPoint(ring, ic.phase + time * ring.speed);
      var d = (pt.depth + 1) / 2;                 // 0 (back) .. 1 (front)
      var scale = 0.84 + 0.30 * d;

      ic.el.style.transform =
        "translate(" + (pt.x * k).toFixed(1) + "px," + (pt.y * k).toFixed(1) + "px) translate(-50%,-50%) scale(" + scale.toFixed(3) + ")";
      ic.el.style.opacity = (0.55 + 0.45 * d).toFixed(2);
      ic.el.style.zIndex = pt.depth > 0 ? 4 : 1;  // globe uses z-index 2
    }
  }

  // ----- Effects rendered over the image -----
  function drawStars(time) {
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i];
      var tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(st.ph + time * st.sp));
      ctx.fillStyle = "rgba(150,215,255," + (0.55 * tw).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawRipples(time) {
    ctx.lineWidth = 2;
    for (var i = 0; i < 3; i++) {
      var u = ((time / 3600) + i / 3) % 1;
      var rx = 170 + 250 * u;
      var ry = rx * 0.15;
      var alpha = Math.pow(1 - u, 1.6) * 0.55;
      ctx.strokeStyle = "rgba(60,200,255," + alpha.toFixed(3) + ")";
      ctx.lineWidth = 0.8 + 2.2 * (1 - u);
      ctx.beginPath();
      ctx.ellipse(PLATFORM.x, PLATFORM.y + 6, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // The base's central glow pulses gently
    var glow = 0.5 + 0.5 * Math.sin(time * 0.0022);
    var g = ctx.createRadialGradient(PLATFORM.x, PLATFORM.y, 0, PLATFORM.x, PLATFORM.y, 120);
    g.addColorStop(0, "rgba(90,210,255," + (0.12 + 0.16 * glow).toFixed(3) + ")");
    g.addColorStop(1, "rgba(90,210,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(PLATFORM.x - 130, PLATFORM.y - 90, 260, 180);
  }

  function drawParticles(time) {
    for (var i = 0; i < parts.length; i++) {
      var q = parts[i];
      var t = (q.t + time * q.sp) % 1;
      var x = PLATFORM.x + q.dx * (1 - 0.55 * t);
      var y = PLATFORM.y - 14 - t * 118;
      var a = Math.sin(Math.PI * t) * 0.85;
      ctx.fillStyle = "rgba(120,225,255," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(x, y, q.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawHeartbeat(time) {
    var ph = (time % 1500) / 1500;
    var amp = Math.exp(-Math.pow((ph - 0.12) / 0.05, 2)) + 0.55 * Math.exp(-Math.pow((ph - 0.30) / 0.07, 2));
    var g = ctx.createRadialGradient(HEART.x, HEART.y, 0, HEART.x, HEART.y, 130);
    g.addColorStop(0, "rgba(90,225,255," + (0.05 + 0.26 * amp).toFixed(3) + ")");
    g.addColorStop(1, "rgba(90,225,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(HEART.x - 140, HEART.y - 140, 280, 280);
  }

  function drawShimmer(time) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(GLOBE.x, GLOBE.y, GLOBE.r, 0, Math.PI * 2);
    ctx.clip();

    var bx = GLOBE.x - GLOBE.r - 40 + ((time / 7000) % 1) * (GLOBE.r * 2 + 80);
    var g = ctx.createLinearGradient(bx - 55, 0, bx + 55, 0);
    g.addColorStop(0, "rgba(120,220,255,0)");
    g.addColorStop(0.5, "rgba(120,220,255,0.16)");
    g.addColorStop(1, "rgba(120,220,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(GLOBE.x - GLOBE.r, GLOBE.y - GLOBE.r, GLOBE.r * 2, GLOBE.r * 2);
    ctx.restore();
  }

  function drawComets(time) {
    ctx.lineCap = "round";
    for (var r = 0; r < RINGS.length; r++) {
      var ring = RINGS[r];
      var head = time * ring.speed * 2.4 + r * 2.1;
      var dir = ring.speed > 0 ? 1 : -1;
      var steps = 16;

      for (var i = steps; i >= 0; i--) {
        var a0 = head - dir * i * 0.032;
        var a1 = head - dir * (i + 1) * 0.032;
        var p0 = ringPoint(ring, a0);
        var p1 = ringPoint(ring, a1);
        var vis = p0.depth > 0 ? 1 : 0.22;     // dim the parts behind the globe
        var alpha = (1 - i / steps) * 0.9 * vis;
        ctx.strokeStyle = "rgba(150,230,255," + alpha.toFixed(3) + ")";
        ctx.lineWidth = 0.8 + 2.2 * (1 - i / steps);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }

      var h = ringPoint(ring, head);
      ctx.save();
      ctx.shadowColor = "rgba(120,225,255,1)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "rgba(230,250,255," + (h.depth > 0 ? 1 : 0.3) + ")";
      ctx.beginPath();
      ctx.arc(h.x, h.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function frame(time) {
    ctx.clearRect(0, 0, DW, DH);
    ctx.globalCompositeOperation = "lighter";
    drawStars(time);
    drawRipples(time);
    drawParticles(time);
    drawShimmer(time);
    drawHeartbeat(time);
    drawComets(time);
    ctx.globalCompositeOperation = "source-over";
    placeIcons(time);
  }

  // ----- Animation loop -----
  var running = false;
  var visible = true;

  function loop(time) {
    if (!running) return;
    frame(time);
    window.requestAnimationFrame(loop);
  }

  function start() {
    if (reduce || running || !visible) return;
    running = true;
    window.requestAnimationFrame(loop);
  }

  function stop() { running = false; }

  resize();
  frame(0);
  start();

  window.addEventListener("resize", function () {
    resize();
    frame(0);
  });

  // Stop rendering when the globe is out of view to save battery
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }).observe(wrap);
  }
})();
