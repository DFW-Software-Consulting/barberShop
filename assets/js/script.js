'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/**
 * mobile navbar
 */

const navbar = $("[data-navbar]");
const navToggler = $("[data-nav-toggler]");
const navLinks = $$("[data-nav-link]");

const setNavbar = (open) => {
  navbar.classList.toggle("active", open);
  navToggler.setAttribute("aria-expanded", String(open));
  navToggler.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};

navToggler.addEventListener("click", () => setNavbar(!navbar.classList.contains("active")));
navLinks.forEach((link) => link.addEventListener("click", () => setNavbar(false)));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navbar.classList.contains("active")) {
    setNavbar(false);
    navToggler.focus();
  }
});

// close the panel if the viewport grows to desktop
window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
  if (e.matches) setNavbar(false);
});



/**
 * sticky header + back-to-top state
 */

const header = $("[data-header]");
const backTopBtn = $("[data-back-top-btn]");

const onScroll = () => {
  const scrolled = window.scrollY > 100;
  header.classList.toggle("active", scrolled);
  backTopBtn.classList.toggle("active", scrolled);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();


/**
 * highlight the nav link of the section in view
 */

if ("IntersectionObserver" in window) {
  const sections = $$("main section[id]");
  const linkFor = (id) => navLinks.filter((l) => l.getAttribute("href") === "#" + id && l.classList.contains("navbar-link"));

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$(".navbar-link.is-current").forEach((l) => {
        l.classList.remove("is-current");
        l.removeAttribute("aria-current");
      });
      linkFor(entry.target.id).forEach((l) => {
        l.classList.add("is-current");
        l.setAttribute("aria-current", "true");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach((s) => spy.observe(s));
}


/**
 * reveal on scroll
 */

const revealEls = $$(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("is-visible");
        io.unobserve(el);
        // hand control back to the element's own hover transitions
        setTimeout(() => {
          el.classList.remove("reveal", "is-visible");
          el.style.transitionDelay = "";
        }, 1000);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    // light stagger for siblings in a grid
    el.style.transitionDelay = (i % 3) * 80 + "ms";
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}


/**
 * pricing filter
 */

const filterBtns = $$("[data-filter-btn]");
const filterItems = $$("[data-filter]");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.filterBtn;

    filterBtns.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });

    filterItems.forEach((item) => {
      item.hidden = !(value === "all" || item.dataset.filter === value);
    });
  });
});


/**
 * forms (demo only, nothing is sent)
 */

const setError = (field, message) => {
  const err = document.getElementById(field.getAttribute("aria-describedby"));
  if (message) {
    field.setAttribute("aria-invalid", "true");
    if (err) err.textContent = message;
  } else {
    field.removeAttribute("aria-invalid");
    if (err) err.textContent = "";
  }
  return !message;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validators = {
  name: (v) => (v.trim().length < 2 ? "Please enter your name." : ""),
  email: (v) => (emailRe.test(v.trim()) ? "" : "Enter a valid email, like you@example.com."),
  phone: (v) => (v.replace(/\D/g, "").length >= 10 ? "" : "Enter a 10-digit phone number."),
  service: (v) => (v ? "" : "Please choose a service."),
  date: (v) => {
    if (!v) return "Please pick a date.";
    const picked = new Date(v + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (picked < today) return "Please pick today or a future date.";
    if (picked.getDay() === 0) return "We are closed on Sundays. Please pick another day.";
    return "";
  },
};

const validateField = (field) => {
  const check = validators[field.name];
  return check ? setError(field, check(field.value)) : true;
};

const wireForm = (form, successEl, successText) => {
  const fields = $$("input, select, textarea", form).filter((f) => validators[f.name]);

  fields.forEach((f) => {
    f.addEventListener("blur", () => { if (f.value) validateField(f); });
    f.addEventListener("input", () => { if (f.hasAttribute("aria-invalid")) validateField(f); });
    f.addEventListener("change", () => { if (f.hasAttribute("aria-invalid")) validateField(f); });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successEl.hidden = true;

    const results = fields.map((f) => validateField(f));
    const firstBad = fields[results.indexOf(false)];
    if (firstBad) {
      firstBad.focus();
      return;
    }

    successEl.textContent = successText(form);
    successEl.hidden = false;
    form.reset();
    if (successEl.tabIndex === -1) successEl.focus();
  });
};

const bookingForm = $("#booking-form");
if (bookingForm) {
  const dateInput = $("#b-date", bookingForm);
  const d = new Date();
  dateInput.min = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");

  wireForm(bookingForm, $("#booking-success"), (form) => {
    const first = form.elements.name.value.trim().split(/\s+/)[0];
    return `Thanks, ${first}! This is a demo site, so your request was not sent and nothing was saved.`;
  });
}

const newsletterForm = $("#newsletter-form");
if (newsletterForm) {
  wireForm(newsletterForm, $("#newsletter-success"), () =>
    "Thanks! This is a demo site, so you were not actually subscribed and nothing was sent.");
}


/**
 * hours: highlight today and show open/closed
 */

const hours = { 0: null, 1: [9, 19], 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [9, 19], 6: [8, 17] };
const now = new Date();
const todayRow = $(`.hours tr[data-day="${now.getDay()}"]`);
if (todayRow) todayRow.classList.add("today");

const statusEl = $("[data-open-status]");
if (statusEl) {
  const range = hours[now.getDay()];
  const hr = now.getHours() + now.getMinutes() / 60;
  statusEl.textContent = range && hr >= range[0] && hr < range[1]
    ? "Open now. Walk-ins welcome."
    : "Closed right now. Book ahead and we will have a chair ready.";
}
