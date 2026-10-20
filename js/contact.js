/* Cappolla's — Contact page behaviors (SPEC-03 §5.5)
   Message form: validates, shows a summary. No data is sent yet (§9). */

"use strict";

(function () {
  const form = document.getElementById("contact-form");
  const summaryWrap = document.getElementById("contact-summary-wrap");
  const summaryEl = document.getElementById("contact-summary");

  function setError(id, msg) {
    const el = document.querySelector('[data-error-for="' + id + '"]');
    if (el) el.textContent = msg || "";
  }

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    setError("k-name", "");
    setError("k-phone", "");
    setError("k-message", "");

    const name = document.getElementById("k-name").value.trim();
    const phone = document.getElementById("k-phone").value.trim();
    const message = document.getElementById("k-message").value.trim();

    let ok = true;
    if (!name) { setError("k-name", "Name is required."); ok = false; }
    if (!phone) { setError("k-phone", "Phone is required."); ok = false; }
    if (!message) { setError("k-message", "Message is required."); ok = false; }

    if (!ok) return;

    const data = { name: name, phone: phone, message: message };

    let text = "Cappolla's Message\n";
    text += "Name: " + data.name + "\n";
    text += "Phone: " + data.phone + "\n";
    text += "Message: " + data.message + "\n";
    text += "\n(This form does not send data yet.)";

    if (summaryEl) summaryEl.textContent = text;
    if (summaryWrap) {
      summaryWrap.style.display = "grid";
      summaryWrap.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
})();
