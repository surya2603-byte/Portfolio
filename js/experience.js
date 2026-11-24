/* ===== EXPERIENCE: carousel 3D, timeline, panel detail, galeri =====
   Data ada di js/experience-data.js. Tanpa library tambahan. */

(function () {
  var root = document.getElementById("experience");
  var DATA = window.EXPERIENCE_DATA;
  if (!root || !DATA) return;

  var $ = function (s, c) { return (c || root).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || root).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var stage = $("#exp-stage"), track = $("#exp-track"), tl = $("#exp-timeline");
  var tabs = $$(".exp-tab"), glowBar = $(".exp-tab-glow");
  var btnPrev = $(".exp-nav.prev"), btnNext = $(".exp-nav.next");

  var cat = "organizations", active = 0, items = [], cards = [];

  /* ---------- util ---------- */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var I = {
    arrowR: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.8 3.1-6.5 7-6.5s7 2.7 7 6.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></svg>'
  };

  function wrapIdx(i, n) { return (i % n + n) % n; }

  /* swipe / drag generik. Mengembalikan state.moved supaya klik setelah drag bisa diabaikan */
  function swipe(el, cb) {
    var st = { moved: false }, down = false, sx = 0, dx = 0;
    el.addEventListener("pointerdown", function (e) {
      if (e.button > 0) return;
      down = true; st.moved = false; sx = e.clientX; dx = 0;
    });
    el.addEventListener("pointermove", function (e) {
      if (!down) return;
      dx = e.clientX - sx;
      if (!st.moved && Math.abs(dx) > 8) {
        st.moved = true;
        el.classList.add("dragging");
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });
    function up(e) {
      if (!down) return;
      down = false;
      el.classList.remove("dragging");
      if (st.moved) {
        if (dx < -50) cb.next(); else if (dx > 50) cb.prev();
        setTimeout(function () { st.moved = false; }, 40);
      } else if (cb.tap && e.type === "pointerup" && !e.target.closest("button")) {
        cb.tap();
      }
    }
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return st;
  }

  /* ---------- carousel ---------- */

  function logoHTML(it, size) {
    var inner = it.logo
      ? '<img src="' + esc(it.logo) + '" alt="" draggable="false">'
      : "<span>" + esc(it.mark || "") + "</span>";
    return '<div class="exp-logo ' + (size || "") + '">' + inner + "</div>";
  }

  function cardHTML(it) {
    var isOrg = cat === "organizations";
    var title = isOrg ? it.name : it.role;
    var sub = isOrg ? it.role : it.company;
    return (
      '<span class="exp-badge"><i></i>' + (isOrg ? "Organization" : "Work") + "</span>" +
      '<div class="exp-card-main">' + logoHTML(it) +
      "<div><h3>" + esc(title) + '</h3><p class="exp-meta">' + esc(sub) + " • " + esc(it.period) + "</p></div></div>" +
      '<p class="exp-short">' + esc(it.short) + "</p>" +
      '<span class="exp-more">Learn More ' + I.arrowR + "</span>"
    );
  }

  function layout() {
    if (!cards.length) return;
    var w = cards[0].offsetWidth || 360;
    var narrow = stage.clientWidth < 720;
    var step = w * (narrow ? 0.66 : 0.84);
    var vis = narrow ? 1 : 2;
    cards.forEach(function (c, i) {
      var o = i - active, a = Math.abs(o), show = a <= vis;
      var x = o * step, y = a * 16, z = -a * (narrow ? 130 : 180);
      var ry = -o * (narrow ? 24 : 30), rz = o * 1.6, s = 1 - a * 0.09;
      c.style.transform =
        "translate(-50%,-50%) translate3d(" + x + "px," + y + "px," + z + "px) rotateY(" + ry + "deg) rotateZ(" + rz + "deg) scale(" + s + ")";
      c.style.zIndex = String(10 - a);
      c.style.opacity = show ? (a === 0 ? 1 : Math.max(0.4, 1 - a * 0.28)) : 0;
      c.style.pointerEvents = show ? "auto" : "none";
      c.classList.toggle("is-active", o === 0);
      c.setAttribute("aria-hidden", show ? "false" : "true");
      c.tabIndex = o === 0 ? 0 : -1;
    });
    btnPrev.disabled = active === 0;
    btnNext.disabled = active === items.length - 1;
  }

  function buildTimeline() {
    var n = items.length;
    tl.style.setProperty("--n", n);
    tl.classList.toggle("single", n < 2);
    tl.innerHTML =
      '<div class="exp-tl-line"><span class="exp-tl-fill"></span></div><ol class="exp-tl-nodes">' +
      items.map(function (it, i) {
        return '<li><button type="button" class="exp-tl-btn" data-i="' + i + '" aria-label="' + esc(it.period) + '">' +
          '<span class="exp-node"></span><span class="exp-tl-label">' + esc(it.period) + "</span></button></li>";
      }).join("") + "</ol>";
  }

  function updateTimeline() {
    var n = items.length;
    var fill = $(".exp-tl-fill", tl);
    if (fill) fill.style.setProperty("--p", (n > 1 ? (active / (n - 1)) * 100 : 0) + "%");
    $$(".exp-tl-btn", tl).forEach(function (b, i) {
      b.classList.toggle("is-on", i === active);
      b.classList.toggle("is-past", i < active);
      if (i === active) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
  }

  function setActive(i) {
    i = Math.max(0, Math.min(items.length - 1, i));
    if (i === active) return;
    active = i;
    layout();
    updateTimeline();
  }

  function build() {
    items = DATA[cat] || [];
    active = 0;
    root.setAttribute("data-cat", cat);
    track.innerHTML = "";
    cards = items.map(function (it, i) {
      var c = document.createElement("div");
      c.className = "exp-card";
      c.setAttribute("role", "button");
      c.dataset.i = i;
      c.setAttribute("aria-label", (cat === "organizations" ? it.name : it.role) + ", " + it.period);
      c.innerHTML = cardHTML(it);
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        c.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
      track.appendChild(c);
      return c;
    });
    buildTimeline();
    layout();
    updateTimeline();
  }

  function moveGlow() {
    var t = tabs.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0];
    if (!t || !glowBar) return;
    glowBar.style.width = t.offsetWidth + "px";
    glowBar.style.transform = "translateX(" + t.offsetLeft + "px)";
  }

  function setCat(c) {
    if (c === cat) return;
    cat = c;
    tabs.forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.cat === c)); });
    moveGlow();
    stage.classList.add("is-switching");
    tl.classList.add("is-switching");
    setTimeout(function () {
      build();
      stage.classList.remove("is-switching");
      tl.classList.remove("is-switching");
    }, reduce ? 0 : 280);
  }

  tabs.forEach(function (b) { b.addEventListener("click", function () { setCat(b.dataset.cat); }); });
  btnPrev.addEventListener("click", function () { setActive(active - 1); });
  btnNext.addEventListener("click", function () { setActive(active + 1); });
  tl.addEventListener("click", function (e) {
    var b = e.target.closest(".exp-tl-btn");
    if (b) setActive(+b.dataset.i);
  });

  var dragState = swipe(stage, {
    next: function () { setActive(active + 1); },
    prev: function () { setActive(active - 1); }
  });

  track.addEventListener("click", function (e) {
    if (dragState.moved) return;
    var c = e.target.closest(".exp-card");
    if (!c) return;
    var i = +c.dataset.i;
    if (i === active) openDetail(i); else setActive(i);
  });

  track.addEventListener("keydown", function (e) {
    var c = e.target.closest(".exp-card");
    if (c && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      var i = +c.dataset.i;
      if (i === active) openDetail(i); else setActive(i);
    }
  });

  stage.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { setActive(active + 1); focusActive(); }
    if (e.key === "ArrowLeft") { setActive(active - 1); focusActive(); }
  });

  function focusActive() {
    if (cards[active]) cards[active].focus({ preventScroll: true });
  }

  /* ---------- galeri ---------- */

  function galleryHTML(list, chrome) {
    if (!list || !list.length) return "";
    var slides = list.map(function (g) {
      return '<figure class="exp-slide"><img src="' + esc(g.src) + '" alt="' + esc(g.caption || "") + '" loading="lazy" draggable="false">' +
        (g.caption ? "<figcaption>" + esc(g.caption) + "</figcaption>" : "") + "</figure>";
    }).join("");
    var thumbs = list.map(function (g, i) {
      return '<button type="button" class="exp-thumb" aria-label="Show image ' + (i + 1) + '"><img src="' + esc(g.src) + '" alt="" loading="lazy" draggable="false"></button>';
    }).join("");
    var multi = list.length > 1;
    return (
      '<div class="exp-gallery"><div class="exp-frame' + (chrome ? " browser" : "") + '">' + (chrome || "") +
      '<div class="exp-viewer" tabindex="0" aria-label="Image gallery"><div class="exp-slides">' + slides + "</div>" +
      (multi ? '<button type="button" class="exp-gnav prev" aria-label="Previous image">' + I.chevL + '</button><button type="button" class="exp-gnav next" aria-label="Next image">' + I.chevR + "</button>" : "") +
      '<span class="exp-count"></span><button type="button" class="exp-zoom" aria-label="Enlarge image">' + I.zoom + "</button></div></div>" +
      (multi ? '<div class="exp-thumbs">' + thumbs + "</div>" : "") + "</div>"
    );
  }

  function initGallery(el, list) {
    var slides = $(".exp-slides", el), viewer = $(".exp-viewer", el), box = $(".exp-thumbs", el);
    var thumbs = $$(".exp-thumb", el), count = $(".exp-count", el), n = list.length, idx = 0;

    function go(i) {
      idx = wrapIdx(i, n);
      slides.style.transform = "translateX(" + -idx * 100 + "%)";
      count.textContent = idx + 1 + " / " + n;
      thumbs.forEach(function (t, k) {
        t.classList.toggle("is-on", k === idx);
        if (k === idx) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current");
      });
      var t = thumbs[idx];
      if (t && box) box.scrollTo({ left: t.offsetLeft - box.clientWidth / 2 + t.offsetWidth / 2, behavior: reduce ? "auto" : "smooth" });
    }
    thumbs.forEach(function (t, k) { t.addEventListener("click", function () { go(k); }); });
    var p = $(".exp-gnav.prev", el), nx = $(".exp-gnav.next", el);
    if (p) p.addEventListener("click", function (e) { e.stopPropagation(); go(idx - 1); });
    if (nx) nx.addEventListener("click", function (e) { e.stopPropagation(); go(idx + 1); });
    $(".exp-zoom", el).addEventListener("click", function (e) { e.stopPropagation(); openLB(list, idx, go); });
    viewer.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
      if (e.key === "Enter") openLB(list, idx, go);
    });
    swipe(viewer, {
      next: function () { go(idx + 1); },
      prev: function () { go(idx - 1); },
      tap: function () { openLB(list, idx, go); }
    });
    go(0);
  }

  /* ---------- lightbox ---------- */

  var lb = document.createElement("div");
  lb.className = "exp-lightbox";
  lb.hidden = true;
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Enlarged image");
  lb.innerHTML =
    '<button type="button" class="exp-lb-close" aria-label="Close image">' + I.close + "</button>" +
    '<div class="exp-lb-view"><div class="exp-lb-slides"></div></div>' +
    '<button type="button" class="exp-gnav prev" aria-label="Previous image">' + I.chevL + "</button>" +
    '<button type="button" class="exp-gnav next" aria-label="Next image">' + I.chevR + "</button>" +
    '<p class="exp-lb-cap"></p>';
  document.body.appendChild(lb);

  var lbSlides = $(".exp-lb-slides", lb), lbCap = $(".exp-lb-cap", lb);
  var lbList = [], lbIdx = 0, lbOpen = false, lbSync = null, lbLast = null;

  function lbGo(i) {
    lbIdx = wrapIdx(i, lbList.length);
    lbSlides.style.transform = "translateX(" + -lbIdx * 100 + "%)";
    var g = lbList[lbIdx];
    lbCap.textContent = (g.caption ? g.caption + "  " : "") + "(" + (lbIdx + 1) + "/" + lbList.length + ")";
  }

  function openLB(list, start, sync) {
    lbList = list; lbSync = sync; lbLast = document.activeElement;
    lbSlides.innerHTML = list.map(function (g) {
      return '<div class="exp-lb-slide"><img src="' + esc(g.src) + '" alt="' + esc(g.caption || "") + '" draggable="false"></div>';
    }).join("");
    $$(".exp-gnav", lb).forEach(function (b) { b.hidden = list.length < 2; });
    lb.hidden = false;
    lbOpen = true;
    lbSlides.style.transition = "none";
    lbGo(start);
    void lbSlides.offsetWidth;
    lbSlides.style.transition = "";
    requestAnimationFrame(function () { requestAnimationFrame(function () { lb.classList.add("is-open"); }); });
    $(".exp-lb-close", lb).focus({ preventScroll: true });
  }

  function closeLB() {
    if (!lbOpen) return;
    lbOpen = false;
    lb.classList.remove("is-open");
    if (lbSync) lbSync(lbIdx);
    setTimeout(function () { lb.hidden = true; lbSlides.innerHTML = ""; }, reduce ? 0 : 320);
    if (lbLast && lbLast.focus) lbLast.focus({ preventScroll: true });
  }

  $(".exp-lb-close", lb).addEventListener("click", closeLB);
  $(".exp-gnav.prev", lb).addEventListener("click", function () { lbGo(lbIdx - 1); });
  $(".exp-gnav.next", lb).addEventListener("click", function () { lbGo(lbIdx + 1); });
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target.classList.contains("exp-lb-slide") || e.target === $(".exp-lb-view", lb)) closeLB();
  });
  swipe($(".exp-lb-view", lb), { next: function () { lbGo(lbIdx + 1); }, prev: function () { lbGo(lbIdx - 1); } });

  /* ---------- panel detail ---------- */

  var modal = document.createElement("div");
  modal.className = "exp-modal";
  modal.hidden = true;
  modal.innerHTML =
    '<div class="exp-backdrop" data-close></div>' +
    '<div class="exp-panel" role="dialog" aria-modal="true" aria-labelledby="exp-dlg-title" tabindex="-1">' +
    '<button type="button" class="exp-close" data-close aria-label="Close details">' + I.close + "</button>" +
    '<div class="exp-panel-body"></div></div>';
  document.body.appendChild(modal);

  var panel = $(".exp-panel", modal), body = $(".exp-panel-body", modal);
  var lastFocus = null, closing = false;

  function sec(title, inner) {
    return inner ? '<section class="exp-sec exp-s"><h4 class="exp-h">' + title + "</h4>" + inner + "</section>" : "";
  }
  function list(arr, cls) {
    return arr && arr.length ? '<ul class="' + cls + '">' + arr.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" : "";
  }

  var TECH = {
    HTML: "#e34f26", CSS: "#1572b6", JavaScript: "#f2c811", React: "#2bb7da", "Next.js": "#94a3b8",
    GitHub: "#94a3b8", Figma: "#a259ff", Python: "#3f8bd0", MATLAB: "#ff8a3d", Simulink: "#e8b923", 
    Excel: "#21a366", Word: "#2b579a", DAVA: "#a855f7",  "UIM Tools": "#06b6d4", NumPy: "#4DABCF",
    SciPy: "#8CAAE6", Matplotlib: "#11557C", Simulink: "#e8b923"
  };
  function techHTML(arr) {
    if (!arr || !arr.length) return "";
    return '<ul class="exp-tech">' + arr.map(function (t) {
      var c = TECH[t] || "#1ec8ff";
      return '<li style="--c:' + c + '"><b>' + esc(t.slice(0, 2)) + "</b>" + esc(t) + "</li>";
    }).join("") + "</ul>";
  }

  function orgHTML(it) {
    var media = it.gallery && it.gallery.length
      ? '<div class="exp-d-media exp-s"><h4 class="exp-h">Documentation Gallery</h4>' + galleryHTML(it.gallery) + "</div>" : "";
    return (
      '<div class="exp-d org' + (media ? "" : " no-media") + '">' + media + '<div class="exp-d-info">' +
      '<span class="exp-badge exp-s"><i></i>Organization</span>' +
      '<div class="exp-id exp-s">' + logoHTML(it, "lg") + '<div><h2 id="exp-dlg-title">' + esc(it.name) + "</h2><p>" + esc(it.institution) + "</p></div></div>" +
      '<div class="exp-facts exp-s"><span>' + I.user + esc(it.role) + "</span><span>" + I.cal + esc(it.period) + "</span></div>" +
      sec("Organization Overview", it.overview ? "<p>" + esc(it.overview) + "</p>" : "") +
      sec("My Contributions", list(it.contributions, "exp-checks")) +
      sec("Achievements", list(it.achievements, "exp-stars")) +
      sec("Skills Developed", list(it.skills, "exp-skillchips")) +
      "</div></div>"
    );
  }

  function workHTML(it) {
    var chrome = '<div class="exp-bar"><i></i><i></i><i></i><span>' + esc(it.company) + "</span></div>";
    var show = it.showcase && it.showcase.length ? sec("Work Showcase", galleryHTML(it.showcase, chrome)) : "";
    var steps = it.responsibilities && it.responsibilities.length
      ? '<ol class="exp-steps">' + it.responsibilities.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol>" : "";
    return (
      '<div class="exp-d work">' +
      '<header class="exp-w-head exp-s">' + logoHTML(it, "xl") +
      '<div class="exp-w-title"><span class="exp-badge"><i></i>Work Experience</span><h2 id="exp-dlg-title">' + esc(it.role) + "</h2><p>" + esc(it.company) + "</p></div>" +
      '<div class="exp-facts"><span>' + I.cal + esc(it.period) + "</span>" + (it.location ? "<span>" + I.pin + esc(it.location) + "</span>" : "") + "</div></header>" +
      '<div class="exp-w-grid"><div class="exp-w-left">' + show + sec("Results &amp; Achievements", list(it.results, "exp-results")) +
      '</div><div class="exp-w-right">' +
      sec("Work Overview", it.overview ? "<p>" + esc(it.overview) + "</p>" : "") +
      sec("Responsibilities", steps) +
      sec("Technologies &amp; Tools", techHTML(it.tech)) +
      "</div></div></div>"
    );
  }

  function openDetail(i) {
    var it = items[i];
    if (!it || closing) return;
    lastFocus = document.activeElement;
    body.innerHTML = cat === "organizations" ? orgHTML(it) : workHTML(it);
    modal.dataset.kind = cat;
    $$(".exp-s", body).forEach(function (el, k) { el.style.setProperty("--i", k); });
    $$(".exp-gallery", body).forEach(function (g) {
      var data = cat === "organizations" ? it.gallery : it.showcase;
      initGallery(g, data);
    });
    modal.hidden = false;
    document.documentElement.classList.add("exp-lock");
    body.scrollTop = 0;
    requestAnimationFrame(function () { requestAnimationFrame(function () { modal.classList.add("is-open"); }); });
    $(".exp-close", modal).focus({ preventScroll: true });
  }

  function closeDetail() {
    if (closing || modal.hidden) return;
    closing = true;
    modal.classList.remove("is-open");
    setTimeout(function () {
      modal.hidden = true;
      body.innerHTML = "";
      document.documentElement.classList.remove("exp-lock");
      closing = false;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }, reduce ? 0 : 400);
  }

  modal.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) closeDetail();
  });

  function trap(e, scope) {
    if (e.key !== "Tab") return;
    var f = $$('button, [href], [tabindex]:not([tabindex="-1"])', scope).filter(function (x) { return x.offsetParent !== null && !x.disabled; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  document.addEventListener("keydown", function (e) {
    if (lbOpen) {
      if (e.key === "Escape") { e.preventDefault(); closeLB(); }
      else if (e.key === "ArrowRight") lbGo(lbIdx + 1);
      else if (e.key === "ArrowLeft") lbGo(lbIdx - 1);
      else trap(e, lb);
      return;
    }
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeDetail(); else trap(e, panel);
  });

    /* ---------- geser otomatis ---------- */

  var AUTO_MS = 4500;   // jeda antar kartu, dalam milidetik (4500 = 4,5 detik)
  var autoTimer = 0, hovering = false;

  function autoStop() {
    clearInterval(autoTimer);
    autoTimer = 0;
  }

  function autoStart() {
    autoStop();
    if (reduce) return;
    autoTimer = setInterval(function () {
      if (items.length < 2) return;
      if (hovering || document.hidden) return;
      if (root.classList.contains("is-off")) return;            // section tidak terlihat
      if (modal.classList.contains("is-open") || lbOpen) return; // panel detail terbuka
      if (stage.classList.contains("dragging")) return;
      setActive(active >= items.length - 1 ? 0 : active + 1);
    }, AUTO_MS);
  }

  // Berhenti saat kursor di atas carousel
  stage.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hovering = true; });
  stage.addEventListener("pointerleave", function () { hovering = false; });

  // Setiap kali pengunjung berinteraksi, hitung mundur diulang dari awal
  stage.addEventListener("pointerdown", autoStart);
  tl.addEventListener("click", autoStart);
  btnPrev.addEventListener("click", autoStart);
  btnNext.addEventListener("click", autoStart);
  tabs.forEach(function (b) { b.addEventListener("click", autoStart); });

  /* ---------- awal ---------- */

  build();
  moveGlow();
  autoStart();

  var raf = 0;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () { layout(); moveGlow(); });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveGlow(); layout(); });

  /* animasi masuk + jeda animasi latar saat section di luar layar */
  var reveals = $$("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    root.classList.add("js-ready");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { root.classList.toggle("is-off", !en.isIntersecting); });
    }).observe(root);
  }
})();