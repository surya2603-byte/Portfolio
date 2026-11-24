/* ===== TEMA: gelap (default) / terang =====
   Pilihan disimpan di localStorage. Script kecil di <head> index.html
   memasang tema lebih awal agar tidak berkedip saat halaman dibuka. */

(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var isDark = theme === "dark";
    btn.setAttribute("aria-checked", String(isDark));
    document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  }

  // sinkronkan tombol dengan tema yang sudah dipasang di <head>
  apply(root.getAttribute("data-theme") || "dark");

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* abaikan */ }
  });
})();
