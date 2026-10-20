/* Cappolla's — UI behaviors shared by every page (SPEC-03 §4, §7)
   Mobile nav sheet, footer phone copy. Menu/cart JS lives in its own files. */

"use strict";

(function () {
  /* ---------- mobile nav sheet ---------- */
  const sheet = document.getElementById("navsheet");
  const toggle = document.querySelector(".nav-toggle");

  if (sheet && toggle) {
    const setExpanded = (v) => toggle.setAttribute("aria-expanded", String(v));

    const openSheet = () => {
      sheet.showModal();
      setExpanded(true);
      const first = sheet.querySelector("a, button");
      if (first) first.focus();
    };

    const closeSheet = () => {
      if (sheet.open) sheet.close();
      setExpanded(false);
    };

    toggle.addEventListener("click", openSheet);

    // Fires for Escape and programmatic closes too
    sheet.addEventListener("close", () => {
      setExpanded(false);
      toggle.focus();
    });

    // Nav links and the close button close the sheet
    sheet.addEventListener("click", (e) => {
      if (e.target.closest("a, [data-close-sheet]")) closeSheet();
    });

    // Backdrop tap closes
    sheet.addEventListener("click", (e) => {
      if (e.target === sheet) closeSheet();
    });
  }

  /* ---------- copy buttons ([data-copy="text"]) ---------- */
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;

    const text = btn.getAttribute("data-copy");
    const status = btn.parentElement
      ? btn.parentElement.querySelector(".copy-feedback")
      : null;

    const done = (ok) => {
      if (!status) return;
      status.textContent = ok ? "Copied" : "Press and hold to copy";
    };

    try {
      await navigator.clipboard.writeText(text);
      done(true);
    } catch (err) {
      // Fallback: select the number so the user can copy manually
      const num = btn.parentElement && btn.parentElement.querySelector(".call-number");
      if (num) {
        const range = document.createRange();
        range.selectNodeContents(num);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      done(false);
    }
  });
})();
