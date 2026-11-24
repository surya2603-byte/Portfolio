
/* ===== EDUCATION: scroll reveal animation
   - Elements with data-reveal appear when they enter the viewport
   - Background animations pause when the section is outside the viewport */

(function () {
  var root = document.getElementById("education");
  if (!root) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = Array.prototype.slice.call(root.querySelectorAll("[data-reveal]"));

  // Disable animations and display all elements immediately
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  root.classList.add("js-ready");

  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) { reveal.observe(el); });

  var visibility = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      root.classList.toggle("is-off", !entry.isIntersecting);
    });
  });

  visibility.observe(root);
})();
