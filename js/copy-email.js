
/* ===== COPY EMAIL =====
   Buttons with the data-copy-email attribute will copy the email address. */

(function () {
  var EMAIL = "suryawardana2603@gmail.com";

  function fallbackCopy(text, onSuccess) {
    var area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();

    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(area);

    if (ok) onSuccess();
    else alert("Tidak bisa menyalin otomatis. Salin manual: " + text);
  }

  function handleClick(button) {
    var original = button.innerHTML;

    function showCopied() {
      button.innerHTML = "✓";
      button.title = "Email copied!";
      button.setAttribute("aria-label", "Email address copied");
      button.style.color = "var(--ok)";

      window.setTimeout(function () {
        button.innerHTML = original;
        button.title = "Copy email address";
        button.setAttribute("aria-label", "Copy email address");
        button.style.color = "";
      }, 1500);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(EMAIL).then(showCopied).catch(function () {
        fallbackCopy(EMAIL, showCopied);
      });
    } else {
      fallbackCopy(EMAIL, showCopied);
    }
  }

  document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
    btn.addEventListener("click", function () { handleClick(btn); });
  });
})();
