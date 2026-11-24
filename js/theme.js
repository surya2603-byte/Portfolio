
/* ===== THEME: dark (default) / light =====
   The selected theme is saved in localStorage. A small script in the
   <head> of index.html applies the theme early to prevent flashing
   when the page loads. */

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

  // Sync the toggle button with the theme already applied in the <head>
  apply(root.getAttribute("data-theme") || "dark");

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });
})();
