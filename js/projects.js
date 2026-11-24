/* ===== PROJECTS: carousel 3D, cursor tilt, halaman detail =====
   Data ada di js/projects-data.js. File ini hanya menampilkan.
   Alamat: #projects = daftar, #projects/<id> = detail (tombol Back browser berfungsi).
   Galeri mendukung foto dan video (.mp4 / .webm). */

(function () {
  "use strict";

  var root = document.getElementById("projects");
  var data = window.PROJECTS;
  if (!root || !Array.isArray(data) || !data.length) return;
  var host = root.querySelector("[data-prj-host]");
  if (!host) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var n = data.length, cur = 0, mode = "list", openId = null;
  var cards = [], countEl = null, lb = null, lbs = null, gal = null;

  /* ---------- util ---------- */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function val(s) { return s ? esc(s) : '<span class="prj-muted">—</span>'; }
  function safeUrl(u) { return /^https?:\/\//i.test(u || "") ? u : ""; }

  function ic(d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  }
  var I = {
    arrow: ic('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
    left: ic('<path d="m15 5-7 7 7 7"/>'),
    right: ic('<path d="m9 5 7 7-7 7"/>'),
    back: ic('<path d="M19 12H5m6-6-6 6 6 6"/>'),
    full: ic('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    check: ic('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
    photo: ic('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 9"/>'),
    user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>'),
    cal: ic('<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    tag: ic('<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>'),
    code: ic('<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>'),
    challenge: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>'),
    solution: ic('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'),
    features: ic('<path d="M4 7h16M4 12h16M4 17h10"/>'),
    result: ic('<path d="M4 20h16M7 20v-7M12 20V6M17 20v-10"/>'),
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
  };

  function ph() {
    return '<div class="prj-ph" role="img" aria-label="Photo placeholder">' + I.photo + "<span>Photo coming soon</span></div>";
  }
  function pic(src, alt, eager) {
    return src
      ? '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' + (eager ? "" : ' loading="lazy"') + ' decoding="async" draggable="false">'
      : ph();
  }
  // latar buram dari foto itu sendiri, mengisi sisi kosong saat foto ditampilkan utuh
  // jalur dibuat absolut: url() di dalam variabel CSS dibaca relatif ke folder css/, bukan ke halaman
  function bgUrl(src) {
    var u = String(src);
    try { u = new URL(u, document.baseURI).href; } catch (e) { /* pakai apa adanya */ }
    return 'url("' + u.replace(/["\\\s]/g, encodeURIComponent) + '")';
  }
  function bgStyle(src) { return src ? ' style="--ph:' + esc(bgUrl(src)) + '"' : ""; }
  // foto yang gagal dimuat diganti placeholder
  host.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG") {
      if (t.closest(".prj-hero")) {
        var nx = t.getAttribute("data-next");
        if (nx) { t.removeAttribute("data-next"); t.src = nx; } else t.remove();
        return;
      }
      var d = document.createElement("div");
      d.innerHTML = ph();
      t.replaceWith(d.firstChild);
    }
  }, true);

  function photos(p) {
    var g = (p.gallery || []).map(function (x) { return typeof x === "string" ? { src: x } : x; })
      .filter(function (x) { return x && x.src; });
    if (!g.length && p.thumbnail) g = [{ src: p.thumbnail, alt: p.title }];
    return g;
  }

  /* ---------- video di galeri ---------- */

  // item galeri dianggap video bila type: "video" atau ekstensinya video
  function isVid(x) {
    return !!x && (x.type === "video" || /\.(mp4|webm|ogv|m4v|mov)([?#]|$)/i.test(x.src || ""));
  }
  // tampilan utama: foto atau video (video memakai kontrol bawaan browser)
  function media(x, alt, eager) {
    return isVid(x)
      ? '<video src="' + esc(x.src) + '"' + (x.poster ? ' poster="' + esc(x.poster) + '"' : "") + ' controls playsinline preload="metadata"></video>'
      : pic(x && x.src, alt, eager);
  }
  // thumbnail: foto, atau video dengan tanda play (memakai poster bila ada)
  function thumbPic(x, alt) {
    if (!isVid(x)) return pic(x.src, alt);
    return (x.poster
      ? pic(x.poster, alt)
      : '<video src="' + esc(x.src) + '#t=0.5" muted playsinline preload="metadata" tabindex="-1"></video>') +
      '<span class="prj-play" aria-hidden="true">' + I.play + "</span>";
  }

  /* ---------- latar: cahaya + partikel halus ---------- */

  var bg = document.createElement("div");
  bg.className = "prj-bg";
  bg.setAttribute("aria-hidden", "true");
  var bgh = '<span class="prj-bgl a"></span><span class="prj-bgl b"></span><span class="prj-grid"></span>';
  for (var i = 0; i < 14; i++) {
    bgh += '<span class="prj-dot" style="--x:' + ((i * 37 + 11) % 97) + "%;--y:" + ((i * 53 + 7) % 91) +
      "%;--s:" + (2 + (i % 3)) + "px;--d:-" + (i * 1.7).toFixed(1) + "s;--t:" + (9 + (i % 5) * 1.5) + 's"></span>';
  }
  bg.innerHTML = bgh;
  root.insertBefore(bg, root.firstChild);

  /* ---------- tampilan 1: showcase (flow 3D, mengikuti cursor) ---------- */

  var list = data;
  var pos = 0, xs = 0, cw = 340, running = false;
  var stageEl = null, trackEl = null;
  var gx = 0, gy = 0, tgx = 0, tgy = 0;
  var fx = fine && !reduce; // tilt global hanya untuk mouse

  // kartu hanya menampilkan satu penjelasan ringkas (cardSummary); judul lengkap ada di halaman detail
  function cardHTML(p, i) {
    return '<a class="prj-card" href="#projects/' + encodeURIComponent(p.id) + '" data-i="' + i + '" style="--n:' + i + '">' +
      '<div class="prj-float"><div class="prj-tilt">' +
      '<div class="prj-media"><div class="prj-img">' + pic(p.thumbnail, p.title) + "</div></div>" +
      '<span class="prj-cat">' + esc(p.category) + "</span>" +
      '<div class="prj-body"><p>' + esc(p.cardSummary || p.title) + "</p></div>" +
      '<span class="prj-go" aria-hidden="true">' + I.arrow + "</span>" +
      '<span class="prj-spot"></span></div></div><span class="prj-reflect"></span></a>';
  }

  var SIGNAL = '<svg viewBox="0 0 320 64" aria-hidden="true" focusable="false">' +
    '<path class="base" pathLength="100" d="M0 34H42L50 34L57 26L64 34H92L99 36L108 8L118 58L126 32H156L164 35L172 27L180 34H214L221 36L230 12L240 56L248 33H282L290 30L297 34H320"/>' +
    '<path class="live" pathLength="100" d="M0 34H42L50 34L57 26L64 34H92L99 36L108 8L118 58L126 32H156L164 35L172 27L180 34H214L221 36L230 12L240 56L248 33H282L290 30L297 34H320"/></svg>';

  function showcaseHTML() {
    return '<div class="prj-flow">' +
      '<div class="container prj-wrap prj-topwrap"><div class="prj-top" data-reveal>' +
      '<div><span class="prj-pill">My Portfolio</span><h2 class="prj-word">Projects<span>.</span></h2></div>' +
      '<div class="prj-aside"><div class="prj-signal" aria-hidden="true">' + SIGNAL + "</div>" +
      '<p class="prj-sub">Drag, scroll, or use the arrow keys.</p></div></div></div>' +
      '<div class="prj-stage" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Projects. Drag or use the arrow keys.">' +
      '<div class="prj-track"></div></div>' +
      '<div class="container prj-wrap"><div class="prj-controls">' +
      '<button class="prj-arrow" type="button" data-prev aria-label="Previous project">' + I.left + "</button>" +
      '<span class="prj-count" aria-live="polite"></span>' +
      '<button class="prj-arrow" type="button" data-next aria-label="Next project">' + I.right + "</button></div></div></div>";
  }

  function mod(a, m) { return ((a % m) + m) % m; }
  function stepPx() { return cw + Math.max(18, cw * 0.06); }
  function measure() { if (cards[0]) cw = cards[0].offsetWidth || cw; }

  // posisi tiap kartu dihitung dari jaraknya (d) ke tengah: makin jauh, makin miring, kecil, dan dalam
  function layout() {
    var half = n / 2, step = stepPx();
    cards.forEach(function (c, i) {
      var d = mod(i - xs, n);
      if (d > half) d -= n;
      var a = Math.abs(d), ac = Math.min(a, 2.5);
      var ry = Math.max(-34, Math.min(34, -d * 20));
      c.style.transform = "translateX(-50%) translate3d(" + (d * step).toFixed(1) + "px,0," + (60 - ac * 110).toFixed(0) +
        "px) rotateY(" + ry.toFixed(2) + "deg) scale(" + (1 - ac * 0.07).toFixed(3) + ")";
      c.style.opacity = Math.max(0, Math.min(1, 2.6 - a)).toFixed(2);
      c.style.zIndex = String(100 - Math.round(a * 10));
      c.style.pointerEvents = a < 2.4 ? "auto" : "none";
      c.style.setProperty("--c", Math.max(0, 1 - a).toFixed(2));
      c.classList.toggle("is-center", a < 0.5);
    });
  }

  function frame() {
    if (!stageEl || !stageEl.isConnected) { running = false; return; }
    var moving = false, diff = pos - xs;
    if (reduce || Math.abs(diff) < 0.0008) xs = pos; else { xs += diff * 0.11; moving = true; }
    layout();
    if (fx) {
      gx += (tgx - gx) * 0.08; gy += (tgy - gy) * 0.08;
      stageEl.style.setProperty("--gx", gx.toFixed(3));
      stageEl.style.setProperty("--gy", gy.toFixed(3));
      if (Math.abs(tgx - gx) + Math.abs(tgy - gy) > 0.003) moving = true;
    }
    if (moving && !root.classList.contains("is-off")) requestAnimationFrame(frame); else running = false;
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }

  function setPos(v) {
    pos = v;
    cur = mod(Math.round(pos), n);
    if (countEl) countEl.textContent = (cur + 1) + " / " + n;
    cards.forEach(function (c, i) {
      c.tabIndex = i === cur ? 0 : -1;
      c.setAttribute("aria-label", "Project " + (i + 1) + " of " + n + ": " + list[i].title);
      if (i === cur) c.setAttribute("aria-current", "true"); else c.removeAttribute("aria-current");
    });
    kick();
  }

  function go(i) {
    var d = mod(i - cur, n);
    if (d > n / 2) d -= n;
    setPos(Math.round(pos) + d);
  }

  function mountCards() {
    n = list.length; pos = xs = 0; cur = 0;
    trackEl.innerHTML = list.map(cardHTML).join("");
    cards = [].slice.call(trackEl.querySelectorAll(".prj-card"));
    [].forEach.call(host.querySelectorAll("[data-prev],[data-next]"), function (b) { b.disabled = n < 2; });
    measure();
    setPos(0);
    layout();
  }

  function bindShowcase() {
    stageEl = host.querySelector(".prj-stage");
    trackEl = stageEl.querySelector(".prj-track");
    countEl = host.querySelector(".prj-count");
    host.querySelector("[data-prev]").addEventListener("click", function () { go(cur - 1); });
    host.querySelector("[data-next]").addEventListener("click", function () { go(cur + 1); });
    mountCards();

    // klik: kartu samping dibawa ke tengah, kartu tengah membuka detail
    var down = null, dragged = false, swiped = false;
    stageEl.addEventListener("click", function (e) {
      var c = e.target.closest(".prj-card");
      if (!c || e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      if (swiped) return;
      var i = +c.dataset.i;
      if (i === cur) location.hash = c.getAttribute("href").slice(1);
      else go(i);
    });
    stageEl.addEventListener("dragstart", function (e) { e.preventDefault(); });

    // geser dengan mouse atau sentuh
    function end() {
      if (down && dragged) {
        swiped = true;
        setTimeout(function () { swiped = false; }, 80);
        setPos(Math.round(pos));
      }
      down = null;
      stageEl.classList.remove("is-drag");
    }
    stageEl.addEventListener("pointerdown", function (e) {
      if (e.button > 0) return;
      down = { x: e.clientX, p: pos, id: e.pointerId };
      dragged = false;
    });
    stageEl.addEventListener("pointerup", end);
    stageEl.addEventListener("pointercancel", end);

    // scroll horizontal (trackpad)
    var wl = 0;
    stageEl.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      var t = Date.now();
      if (t - wl < 350) return;
      wl = t;
      go(cur + (e.deltaX > 0 ? 1 : -1));
    }, { passive: false });

    // cursor kustom, tilt global, dan tilt per kartu
    var raf = 0, pend = null;
    function tick() {
      raf = 0;
      if (!pend) return;
      var c = pend.c, r = c.getBoundingClientRect();
      var px = Math.max(-1, Math.min(1, (pend.x - r.left) / r.width * 2 - 1));
      var py = Math.max(-1, Math.min(1, (pend.y - r.top) / r.height * 2 - 1));
      var s = c.style;
      c.classList.add("is-hover");
      s.setProperty("--ry", (px * 7).toFixed(2) + "deg");
      s.setProperty("--rx", (-py * 5).toFixed(2) + "deg");
      s.setProperty("--mx", ((px + 1) * 50).toFixed(1) + "%");
      s.setProperty("--my", ((py + 1) * 50).toFixed(1) + "%");
      s.setProperty("--px", px.toFixed(3));
      s.setProperty("--py", py.toFixed(3));
    }
    function reset(c) {
      if (pend && pend.c === c) pend = null;
      c.classList.remove("is-hover");
      ["--rx", "--ry", "--mx", "--my", "--px", "--py"].forEach(function (k) { c.style.removeProperty(k); });
    }
    stageEl.addEventListener("pointermove", function (e) {
      if (down) {
        var dx = e.clientX - down.x;
        if (!dragged && Math.abs(dx) > 7) {
          dragged = true;
          stageEl.classList.add("is-drag");
          try { stageEl.setPointerCapture(down.id); } catch (err) { /* abaikan */ }
        }
        if (dragged) { pos = down.p - dx / stepPx(); kick(); }
      }
      if (!fx || e.pointerType !== "mouse") return;
      var r = stageEl.getBoundingClientRect();
      tgx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      tgy = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      var c = e.target.closest(".prj-card");
      if (c && !dragged) {
        pend = { c: c, x: e.clientX, y: e.clientY };
        if (!raf) raf = requestAnimationFrame(tick);
      }
      kick();
    });
    stageEl.addEventListener("pointerout", function (e) {
      var c = e.target.closest(".prj-card");
      if (c && !c.contains(e.relatedTarget)) reset(c);
    });
    stageEl.addEventListener("pointerleave", function () {
      tgx = tgy = 0;
      cards.forEach(reset);
      kick();
    });
  }

  window.addEventListener("resize", function () {
    if (mode === "list" && stageEl && stageEl.isConnected) { measure(); layout(); }
  });

  /* ---------- tampilan 2: detail ---------- */

  function detailHTML(p) {
    var g = photos(p);
    var hs = [p.heroImage, g[0] && (isVid(g[0]) ? g[0].poster : g[0].src), p.thumbnail].filter(Boolean);
    var hero = '<div class="prj-hero' + (hs.length ? "" : " none") + '" aria-hidden="true">' +
      (hs.length ? '<img src="' + esc(hs[0]) + '"' + (hs[1] && hs[1] !== hs[0] ? ' data-next="' + esc(hs[1]) + '"' : "") + ' alt="" decoding="async">' : "") + "</div>";
    var tech = (p.technologies || []).map(function (t) { return '<li class="prj-chip">' + esc(t) + "</li>"; }).join("");
    var feats = (p.features || []).length
      ? '<ul class="prj-feats">' + p.features.map(function (f) { return "<li>" + I.check + "<span>" + esc(f) + "</span></li>"; }).join("") + "</ul>"
      : '<p class="prj-muted">To be added.</p>';
    function txt(s) { return s ? "<p>" + esc(s) + "</p>" : '<p class="prj-muted">To be added.</p>'; }
    var url = p.link && safeUrl(p.link.url);
    var link = url ? '<a class="prj-link" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(p.link.label || "Read more") + "</a>" : "";

    var thumbs = g.length > 1
      ? '<div class="prj-thumbs"><button class="prj-arrow sm" type="button" data-gp aria-label="Previous photo">' + I.left + "</button>" +
        '<ul class="prj-tlist">' + g.map(function (x, i) {
          return '<li><button type="button" class="prj-thumb" data-t="' + i + '" aria-label="' + (isVid(x) ? "Video " : "Photo ") + (i + 1) + " of " + g.length + '">' + thumbPic(x, x.alt || p.title) + "</button></li>";
        }).join("") + "</ul>" +
        '<button class="prj-arrow sm" type="button" data-gn aria-label="Next photo">' + I.right + "</button></div>"
      : "";

    function row(icon, label, body) {
      return '<div class="prj-row"><span class="prj-ric">' + icon + "</span><div><dt>" + label + "</dt><dd>" + body + "</dd></div></div>";
    }

    return '<div class="prj-dwrap">' + hero + '<div class="container prj-wrap prj-detail">' +
      '<button class="prj-back" type="button" data-back>' + I.back + "Back to Projects</button>" +
      '<div class="prj-dgrid"><div class="prj-dmain">' +
      '<header class="prj-dhead" data-reveal><div class="prj-meta"><span class="prj-pill">' + esc(p.category) + "</span>" +
      "</div>" +
      "<h2>" + esc(p.title) + "</h2><p>" + esc(p.shortDescription) + "</p></header>" +
      '<div class="prj-gal" data-reveal style="--d:1"><figure class="prj-main">' +
      '<div class="prj-main-img"' + bgStyle(g[0] && (g[0].poster || (!isVid(g[0]) && g[0].src))) + ">" + media(g[0], g[0] && (g[0].alt || p.title), true) + "</div>" +
      (g.length ? '<button class="prj-full" type="button" data-full aria-label="View fullscreen">' + I.full + "</button>" : "") +
      "</figure>" + thumbs + "</div></div>" +
      '<aside class="prj-panel" data-reveal style="--d:2"><h3>Project Details</h3><dl>' +
      row(I.user, "Client", val(p.client)) + row(I.cal, "Year", val(p.year)) + row(I.tag, "Category", val(p.category)) +
      row(I.code, "Technologies", tech ? '<ul class="prj-chips sm">' + tech + "</ul>" : val("")) +
      "</dl><h4>About This Project</h4>" + txt(p.fullDescription || p.shortDescription) + "</aside></div>" +
      '<div class="prj-story">' +
      [["The Challenge", I.challenge, txt(p.challenge)], ["The Solution", I.solution, txt(p.solution)],
       ["Key Features", I.features, feats], ["The Result", I.result, txt(p.result) + link]]
        .map(function (s, i) {
          return '<section class="prj-scard" data-reveal style="--d:' + (i % 2) + '"><h3><span class="prj-ric">' + s[1] + "</span>" + s[0] + "</h3>" + s[2] + "</section>";
        }).join("") + "</div></div></div>";
  }

  function bindDetail(p) {
    var g = photos(p), idx = 0;
    var main = host.querySelector(".prj-main-img");
    var thumbs = [].slice.call(host.querySelectorAll(".prj-thumb"));
    gal = { g: g, p: p, set: setMain, get: function () { return idx; } };

    function setMain(i) {
      if (!g.length) return;
      idx = ((i % g.length) + g.length) % g.length;
      main.classList.add("swap");
      setTimeout(function () {
        var it = g[idx], bs = it.poster || (!isVid(it) && it.src);
        main.innerHTML = media(it, it.alt || p.title, true);
        if (bs) main.style.setProperty("--ph", bgUrl(bs)); else main.style.removeProperty("--ph");
        main.classList.remove("swap");
      }, reduce ? 0 : 180);
      thumbs.forEach(function (t, k) {
        t.classList.toggle("on", k === idx);
        if (k === idx) { t.setAttribute("aria-current", "true"); t.scrollIntoView({ inline: "center", block: "nearest", behavior: reduce ? "auto" : "smooth" }); }
        else t.removeAttribute("aria-current");
      });
    }
    if (thumbs[0]) thumbs[0].classList.add("on");
    thumbs.forEach(function (t, k) { t.addEventListener("click", function () { setMain(k); }); });
    var gp = host.querySelector("[data-gp]"), gn = host.querySelector("[data-gn]"), fu = host.querySelector("[data-full]");
    if (gp) gp.addEventListener("click", function () { setMain(idx - 1); });
    if (gn) gn.addEventListener("click", function () { setMain(idx + 1); });
    if (fu) fu.addEventListener("click", function () { openLB(g, idx, fu); });
    // foto: klik untuk memperbesar. video: klik dipakai untuk play/pause, perbesar lewat tombol layar penuh
    main.addEventListener("click", function () { if (g.length && !isVid(g[idx])) openLB(g, idx, fu); });
    host.querySelector("[data-back]").addEventListener("click", function () { location.hash = "projects"; });
  }

  /* ---------- lightbox ---------- */

  function buildLB() {
    lb = document.createElement("div");
    lb.className = "prj-lb";
    lb.hidden = true;
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Media viewer");
    lb.innerHTML = '<button class="prj-lb-x" type="button" data-x aria-label="Close">' + ic('<path d="M6 6l12 12M18 6 6 18"/>') + "</button>" +
      '<button class="prj-lb-nav l" type="button" data-p aria-label="Previous">' + I.left + "</button>" +
      '<figure><img alt=""><video controls playsinline hidden></video><figcaption></figcaption></figure>' +
      '<button class="prj-lb-nav r" type="button" data-n aria-label="Next">' + I.right + "</button>";
    document.body.appendChild(lb);
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.closest("[data-x]")) closeLB();
      else if (e.target.closest("[data-p]")) stepLB(-1);
      else if (e.target.closest("[data-n]")) stepLB(1);
    });
  }
  function showLB() {
    var it = lbs.g[lbs.i];
    var img = lb.querySelector("img"), vid = lb.querySelector("video");
    if (isVid(it)) {
      img.hidden = true;
      vid.hidden = false;
      vid.poster = it.poster || "";
      vid.src = it.src;
    } else {
      vid.pause();
      vid.removeAttribute("src");
      vid.hidden = true;
      img.hidden = false;
      img.src = it.src;
      img.alt = it.alt || lbs.title || "";
    }
    lb.querySelector("figcaption").textContent = (it.alt || "") + (lbs.g.length > 1 ? "  (" + (lbs.i + 1) + " / " + lbs.g.length + ")" : "");
    lb.classList.toggle("single", lbs.g.length < 2);
  }
  function openLB(g, i, opener) {
    if (!lb) buildLB();
    lbs = { g: g, i: i, opener: opener, title: gal && gal.p.title };
    showLB();
    lb.hidden = false;
    document.documentElement.classList.add("prj-lock");
    lb.querySelector("[data-x]").focus();
  }
  function stepLB(d) {
    lbs.i = ((lbs.i + d) % lbs.g.length + lbs.g.length) % lbs.g.length;
    showLB();
    if (gal) gal.set(lbs.i);
  }
  function closeLB() {
    lb.hidden = true;
    lb.querySelector("video").pause();
    document.documentElement.classList.remove("prj-lock");
    if (lbs && lbs.opener && document.contains(lbs.opener)) lbs.opener.focus();
  }

  /* ---------- keyboard ---------- */

  function inView() {
    var r = root.getBoundingClientRect();
    return r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.3;
  }
  document.addEventListener("keydown", function (e) {
    if (lb && !lb.hidden) {
      if (e.key === "Escape") closeLB();
      else if (e.key === "ArrowLeft" && e.target.tagName !== "VIDEO") stepLB(-1);
      else if (e.key === "ArrowRight" && e.target.tagName !== "VIDEO") stepLB(1);
      return;
    }
    if (/INPUT|TEXTAREA|SELECT|VIDEO/.test(e.target.tagName) || !inView()) return;
    if (mode === "list") {
      if (e.key === "ArrowLeft") go(cur - 1);
      else if (e.key === "ArrowRight") go(cur + 1);
      else if (e.key === "Enter" && e.target.closest && e.target.closest(".prj-stage") && !e.target.closest(".prj-card")) location.hash = "projects/" + encodeURIComponent(list[cur].id);
    } else if (mode === "detail") {
      if (e.key === "Escape") location.hash = "projects";
      else if (gal && gal.g.length > 1 && e.key === "ArrowLeft") gal.set(gal.get() - 1);
      else if (gal && gal.g.length > 1 && e.key === "ArrowRight") gal.set(gal.get() + 1);
    }
  });

  /* ---------- scroll reveal + hemat performa ---------- */

  var io = null;
  var canIO = "IntersectionObserver" in window;
  if (!reduce && canIO) root.classList.add("js-ready");

  function reveal() {
    var t = [].slice.call(host.querySelectorAll("[data-reveal]"));
    if (reduce || !canIO) { t.forEach(function (x) { x.classList.add("in"); }); return; }
    if (!io) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("in");
          io.unobserve(en.target);
        });
      }, { threshold: 0.12 });
    }
    t.forEach(function (x) { io.observe(x); });
  }
  if (canIO) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { root.classList.toggle("is-off", !en.isIntersecting); });
    }).observe(root);
  }

  /* ---------- routing + transisi halaman ---------- */

  function route(first) {
    var m = /^#projects\/(.+)$/.exec(location.hash);
    var id = m ? decodeURIComponent(m[1]) : null;
    var p = id ? data.filter(function (x) { return x.id === id; })[0] : null;
    var next = p ? "detail" : "list";
    if (!first && next === mode && (next === "list" || openId === p.id)) return;

    function render() {
      if (lb && !lb.hidden) closeLB();
      if (p) { mode = "detail"; openId = p.id; host.innerHTML = detailHTML(p); bindDetail(p); }
      else { mode = "list"; openId = null; gal = null; host.innerHTML = showcaseHTML(); bindShowcase(); }
      reveal();
      host.classList.remove("is-out");
    }
    if (first || reduce) {
      render();
      if (first && p) root.scrollIntoView({ block: "start" });
    } else {
      host.classList.add("is-out");
      setTimeout(render, 240);
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  window.addEventListener("hashchange", function () { route(false); });
  route(true);
})();