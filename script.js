// =========================================================
// Abhijeet Patil — Portfolio script
// Header state, mobile menu, active nav, reveal, lightbox
// =========================================================

(() => {
    "use strict";

    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("nav-menu");
    const navLinks = [...menu.querySelectorAll("a[href^='#']")];

    // ---------- Header background on scroll ----------
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ---------- Mobile menu ----------
    const setMenu = (open) => {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menu.classList.toggle("open", open);
        document.body.classList.toggle("no-scroll", open);
    };

    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("open")) {
            setMenu(false);
            toggle.focus();
        }
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
        if (e.matches) setMenu(false);
    });

    // ---------- Active nav link ----------
    const linkFor = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((a) => a.classList.remove("active"));
            const link = linkFor.get(entry.target.id);
            if (link) link.classList.add("active");
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

    // ---------- Reveal on scroll ----------
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach((el) => {
        // Stagger siblings inside the same grid
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
        const i = siblings.indexOf(el);
        if (i > 0) el.style.transitionDelay = `${Math.min(i, 5) * 70}ms`;
        revealObserver.observe(el);
    });

    // ---------- Footer year ----------
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // ---------- Lightbox ----------
    const items = [...document.querySelectorAll(".gallery-btn")];
    const lb = document.getElementById("lightbox");
    if (!items.length || !lb) return;

    const img = lb.querySelector(".lb-img");
    const text = lb.querySelector(".lb-text");
    const count = lb.querySelector(".lb-count");
    const closeBtn = lb.querySelector(".lb-close");
    let index = 0;
    let lastFocus = null;

    const show = (i) => {
        index = (i + items.length) % items.length;
        const item = items[index];
        const thumb = item.querySelector("img");
        img.classList.add("loading");
        // Show the cached thumbnail immediately, then swap in the full image
        img.src = thumb.currentSrc || thumb.src;
        img.alt = thumb.alt;
        const full = new Image();
        full.onload = () => {
            if (items[index] !== item) return;
            img.src = full.src;
            img.classList.remove("loading");
        };
        full.onerror = () => img.classList.remove("loading");
        full.src = item.dataset.full;
        requestAnimationFrame(() => img.classList.remove("loading"));
        text.textContent = item.dataset.caption || thumb.alt;
        count.textContent = `${index + 1} / ${items.length}`;

        // Preload neighbours
        [index + 1, index - 1].forEach((n) => {
            new Image().src = items[(n + items.length) % items.length].dataset.full;
        });
    };

    const open = (i) => {
        lastFocus = document.activeElement;
        lb.hidden = false;
        document.body.classList.add("no-scroll");
        show(i);
        requestAnimationFrame(() => lb.classList.add("open"));
        closeBtn.focus();
    };

    const close = () => {
        lb.classList.remove("open");
        document.body.classList.remove("no-scroll");
        setTimeout(() => { lb.hidden = true; }, 250);
        if (lastFocus) lastFocus.focus();
    };

    items.forEach((btn, i) => btn.addEventListener("click", () => open(i)));
    closeBtn.addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
    lb.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
    lb.addEventListener("click", (e) => {
        if (e.target === lb || e.target.classList.contains("lb-figure")) close();
    });

    document.addEventListener("keydown", (e) => {
        if (lb.hidden) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") show(index + 1);
        else if (e.key === "ArrowLeft") show(index - 1);
        else if (e.key === "Tab") {
            // Keep focus inside the dialog
            const focusables = [...lb.querySelectorAll("button")];
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    // Swipe on touch devices
    let startX = 0;
    let startY = 0;
    lb.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
})();
