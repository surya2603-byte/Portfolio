/* ===== SKILLS: animasi saat di-scroll =====
   - elemen bertanda data-reveal muncul saat masuk layar
   - bar keahlian terisi sampai angka data-level
   - angka persen berhitung naik dari 0
   Untuk mengubah tingkat keahlian, cukup ubah data-level di index.html. */

(function () {
  var root = document.getElementById("skills");
  if (!root) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rows = Array.prototype.slice.call(root.querySelectorAll(".skill-row[data-level]"));

  function levelOf(row) {
    var v = parseFloat(row.getAttribute("data-level"));
    if (isNaN(v)) v = 0;
    return Math.max(0, Math.min(100, v));
  }

  function setValue(row, v) {
    var el = row.querySelector(".sr-val");
    if (el) el.textContent = Math.round(v) + "%";
  }

  // lebar bar diambil dari data-level, angka tampil sesuai
  rows.forEach(function (row) {
    row.style.setProperty("--level", levelOf(row) + "%");
    setValue(row, levelOf(row));
  });

  var targets = Array.prototype.slice.call(root.querySelectorAll("[data-reveal]"));

  // Tanpa animasi: tampilkan semuanya langsung
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
    if (reduce) {
      // titik cahaya orbit di ilustrasi ikut dimatikan
      root.querySelectorAll("animateMotion").forEach(function (m) {
        if (m.parentNode) m.parentNode.removeChild(m);
      });
    }
    return;
  }

  function countUp(row, delay) {
    var to = levelOf(row);
    var t0 = null;
    setValue(row, 0);

    function tick(now) {
      if (t0 === null) t0 = now + delay;
      var p = Math.min(Math.max((now - t0) / 1300, 0), 1);
      var eased = 1 - Math.pow(1 - p, 3);
      setValue(row, to * eased);
      if (p < 1) window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  function reveal(el) {
    el.classList.add("in");
    var list = el.querySelectorAll(".skill-row[data-level]");
    Array.prototype.forEach.call(list, function (row, i) {
      countUp(row, 250 + i * 130);
    });
  }

  root.classList.add("js-ready");

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  targets.forEach(function (el) { observer.observe(el); });
})();