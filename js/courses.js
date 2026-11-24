/* ===== COURSES: animasi masuk layar + pratinjau PDF =====
   - Pratinjau utama: gambar thumbnail di assets/certificates/thumbs/
   - Jika thumbnail tidak ada, halaman 1 PDF dirender dengan PDF.js
   - Jika itu pun gagal, tampil kotak "PDF Certificate" (tombol tetap jalan) */

(function () {
  var root = document.getElementById("courses");
  if (!root) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Reveal saat di-scroll ---------- */

  var targets = Array.prototype.slice.call(root.querySelectorAll("[data-reveal]"));

  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    root.classList.add("js-ready");

    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) { reveal.observe(el); });

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        root.classList.toggle("is-off", !entry.isIntersecting);
      });
    }).observe(root);
  }

  /* ---------- 2. Pratinjau PDF (cadangan) ---------- */

  var CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  var pdfjsPromise = null;

  function loadPdfJs() {
    if (pdfjsPromise) return pdfjsPromise;
    pdfjsPromise = new Promise(function (resolve, reject) {
      if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
      var s = document.createElement("script");
      s.src = CDN + "pdf.min.js";
      s.onload = function () {
        if (!window.pdfjsLib) { reject(new Error("pdfjs missing")); return; }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = CDN + "pdf.worker.min.js";
        resolve(window.pdfjsLib);
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return pdfjsPromise;
  }

  function showEmpty(box, img) {
    if (img && img.parentNode) img.remove();
    var span = document.createElement("span");
    span.className = "crs-empty";
    span.textContent = "PDF CERTIFICATE";
    box.insertBefore(span, box.firstChild);
  }

  function renderFromPdf(card, img) {
    var box = card.querySelector(".crs-thumb");
    var url = card.getAttribute("data-pdf");
    if (!url) { showEmpty(box, img); return; }

    loadPdfJs()
      .then(function (lib) { return lib.getDocument(encodeURI(url)).promise; })
      .then(function (pdf) { return pdf.getPage(1); })
      .then(function (page) {
        var base = page.getViewport({ scale: 1 });
        var scale = Math.min(2, 900 / base.width);
        var vp = page.getViewport({ scale: scale });
        var canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        canvas.setAttribute("role", "img");
        canvas.setAttribute("aria-label", img.alt || "Certificate preview");
        return page.render({ canvasContext: canvas.getContext("2d"), viewport: vp })
          .promise.then(function () { img.replaceWith(canvas); });
      })
      .catch(function () { showEmpty(box, img); });
  }

  Array.prototype.forEach.call(root.querySelectorAll(".crs-card"), function (card) {
    var img = card.querySelector(".crs-thumb img");
    if (!img) return;

    var done = false;
    function fallback() {
      if (done) return;
      done = true;
      renderFromPdf(card, img);
    }

    img.addEventListener("error", fallback);
    // gambar bisa sudah gagal sebelum listener terpasang
    if (img.complete && img.naturalWidth === 0) fallback();
  });
})();