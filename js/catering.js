/* Cappolla's — Catering page behaviors (SPEC-03 §5.3)
   Guest planner + request form (no data sent yet). */

"use strict";

(function () {
  const guestsInput = document.getElementById("guests");
  const dec = document.getElementById("guests-dec");
  const inc = document.getElementById("guests-inc");
  const result = document.getElementById("planner-result");

  const TRAY = { half: [8, 10], full: [16, 20] };

  function plan(n) {
    if (!Number.isInteger(n) || n < 1) return null;
    let full = Math.floor(n / TRAY.full[0]);
    let rest = n - full * TRAY.full[0];
    let half = 0;
    if (rest > 0) {
      if (rest <= TRAY.half[0]) half = 1;
      else full += 1;
    }
    return { full, half, min: full * TRAY.full[0] + half * TRAY.half[0], max: full * TRAY.full[1] + half * TRAY.half[1] };
  }

  function render() {
    if (!guestsInput || !result) return;
    const n = parseInt(guestsInput.value, 10);
    const r = plan(n);
    if (!r) {
      result.textContent = "Enter a guest count to get a tray estimate.";
      return;
    }
    const parts = [];
    if (r.full) parts.push(r.full + (r.full === 1 ? " full tray" : " full trays"));
    if (r.half) parts.push(r.half + (r.half === 1 ? " half tray" : " half trays"));
    result.innerHTML = "Italian trays: <strong>" + parts.join(" + ") + "</strong> covers about " + r.min + "–" + r.max + " people. Mix any dishes.";
  }

  if (dec && guestsInput) {
    dec.addEventListener("click", function () {
      const v = Math.max(1, (parseInt(guestsInput.value, 10) || 0) - 5);
      guestsInput.value = String(v);
      render();
    });
  }
  if (inc && guestsInput) {
    inc.addEventListener("click", function () {
      const v = Math.min(500, (parseInt(guestsInput.value, 10) || 0) + 5);
      guestsInput.value = String(v);
      render();
    });
  }
  if (guestsInput) {
    guestsInput.addEventListener("input", render);
  }
  render();

  // Form
  const form = document.getElementById("catering-form");
  const summaryWrap = document.getElementById("catering-summary-wrap");
  const summaryEl = document.getElementById("catering-summary");
  const guestsField = document.getElementById("c-guests");

  if (guestsInput && guestsField) {
    guestsField.value = guestsInput.value;
    guestsInput.addEventListener("input", function () {
      if (!guestsField.value) guestsField.value = guestsInput.value;
    });
  }

  function setError(id, msg) {
    const el = document.querySelector('[data-error-for="' + id + '"]');
    if (el) el.textContent = msg || "";
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      setError("c-name", "");
      setError("c-phone", "");
      setError("c-email", "");
      setError("c-guests", "");
      setError("c-date", "");
      setError("c-time", "");
      setError("c-method", "");

      const name = document.getElementById("c-name").value.trim();
      const phone = document.getElementById("c-phone").value.trim();
      const email = document.getElementById("c-email").value.trim();
      const guests = document.getElementById("c-guests").value.trim();
      const date = document.getElementById("c-date").value.trim();
      const time = document.getElementById("c-time").value.trim();
      const method = document.getElementById("c-method").value;
      const notes = document.getElementById("c-notes").value.trim();

      let ok = true;
      if (!name) { setError("c-name", "Name is required."); ok = false; }
      if (!phone) { setError("c-phone", "Phone is required."); ok = false; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("c-email", "Enter a valid email."); ok = false; }
      if (!guests || Number(guests) < 1) { setError("c-guests", "Enter number of guests."); ok = false; }
      if (!date) { setError("c-date", "Event date is required."); ok = false; }
      if (!time) { setError("c-time", "Event time is required."); ok = false; }
      if (!method) { setError("c-method", "Select pickup or delivery."); ok = false; }

      if (!ok) return;

      const data = {
        name: name,
        phone: phone,
        email: email,
        guests: Number(guests),
        event_date: date,
        event_time: time,
        pickup_or_delivery: method,
        notes: notes
      };

      let text = "Cappolla's Catering Request\n";
      text += "Name: " + data.name + "\n";
      text += "Phone: " + data.phone + "\n";
      if (data.email) text += "Email: " + data.email + "\n";
      text += "Guests: " + data.guests + "\n";
      text += "Date: " + data.event_date + "\n";
      text += "Time: " + data.event_time + "\n";
      text += "Method: " + data.pickup_or_delivery + "\n";
      if (data.notes) text += "Notes: " + data.notes + "\n";
      text += "\n(This form does not send data yet.)";

      if (summaryEl) summaryEl.textContent = text;
      if (summaryWrap) {
        summaryWrap.style.display = "grid";
        summaryWrap.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
})();
