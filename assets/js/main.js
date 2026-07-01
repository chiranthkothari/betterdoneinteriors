/* Better Done Interiors — interactions */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Scroll progress bar (injected) ----
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);

  // ---- Sticky nav + scroll progress + hero parallax ----
  const nav = document.querySelector(".nav");
  const heroMedia = document.querySelector(".hero-media .frame img");
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 20);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (heroMedia && !reduceMotion && y < window.innerHeight * 1.3) {
      heroMedia.style.transform = "scale(1.06) translateY(" + y * 0.05 + "px)";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ----
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".mobile-menu");
  const close = document.querySelector(".mobile-close");
  const toggleMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (burger) burger.addEventListener("click", () => toggleMenu(true));
  if (close) close.addEventListener("click", () => toggleMenu(false));
  if (menu) menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
  // Tap the dark backdrop (not a link/button) to close
  if (menu) menu.addEventListener("click", (e) => { if (e.target === menu) toggleMenu(false); });
  // Escape key closes
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleMenu(false); });

  // ---- Reveal on scroll ----
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // ---- FAQ accordion ----
  document.querySelectorAll(".faq-q").forEach((q) => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const answer = item.querySelector(".faq-a");
      const isOpen = item.classList.contains("open");
      // close siblings
      document.querySelectorAll(".faq-item.open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !isOpen);
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  });

  // ---- Magnetic buttons (subtle pull toward cursor) ----
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + mx * 0.15 + "px," + my * 0.22 + "px)";
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  // ---- Contact form (front-end only demo) ----
  document.querySelectorAll("form[data-demo]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Thank you — we'll be in touch ✦";
        btn.disabled = true;
        form.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 3500);
      }
    });
  });
})();
