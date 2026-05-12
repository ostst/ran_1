(function () {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-loaded");

  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = mobileNav.hidden;
      mobileNav.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealEls = document.querySelectorAll(".js-reveal");
  if (revealEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Testimonials horizontal scroll */
  const track = document.getElementById("testimonials-track");
  const prev = document.getElementById("testi-prev");
  const next = document.getElementById("testi-next");

  function scrollTestimonials(dir) {
    if (!track) return;
    const card = track.querySelector(".testimonial-card");
    const delta = card ? card.offsetWidth + 18 : 320;
    track.scrollBy({ left: dir * delta, behavior: "smooth" });
  }

  prev?.addEventListener("click", () => scrollTestimonials(-1));
  next?.addEventListener("click", () => scrollTestimonials(1));

  function inputForError(errorId) {
    if (errorId === "consent-error") return document.getElementById("consent");
    const err = document.getElementById(errorId);
    let el = err?.previousElementSibling;
    while (el && el.nodeType === 1 && !["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) {
      el = el.previousElementSibling;
    }
    return el;
  }

  function setError(id, message) {
    const err = document.getElementById(id);
    const input = inputForError(id);
    if (err) err.textContent = message || "";
    if (input && input.classList) {
      input.classList.toggle("invalid", Boolean(message));
    }
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function validatePhone(v) {
    const digits = v.replace(/\D/g, "");
    return digits.length >= 10;
  }

  const form = document.getElementById("application-form");
  const statusEl = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const phone = document.getElementById("phone");
      const consent = document.getElementById("consent");

      setError("name-error");
      setError("email-error");
      setError("phone-error");
      setError("consent-error");

      if (!name.value.trim()) {
        setError("name-error", "Укажите имя");
        ok = false;
      }

      if (!validateEmail(email.value)) {
        setError("email-error", "Введите корректный email");
        ok = false;
      }

      if (!validatePhone(phone.value)) {
        setError("phone-error", "Укажите телефон с кодом города");
        ok = false;
      }

      if (!consent.checked) {
        setError("consent-error", "Необходимо согласие");
        ok = false;
      }

      if (!ok) {
        statusEl.textContent = "";
        return;
      }

      const payload = {
        name: name.value.trim(),
        organization: document.getElementById("org").value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        message: document.getElementById("msg").value.trim(),
      };

      console.info("[demo] Заявка (подключите Bitrix/webhook):", payload);

      statusEl.textContent =
        "Спасибо! Заявка принята в демо-режиме — менеджер свяжется с вами. Для продакшена подключите отправку на сервер или CRM.";
      form.reset();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id.length <= 1) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const headerOffset = 84;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
})();
