// ==============================
// PORTFOLIO SCRIPT V1
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // SCROLL REVEAL ANIMATION
    // ==========================

    const revealElements = document.querySelectorAll(
        ".card, .skill-card, .timeline-item, .project-card"
    );

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {

        element.classList.add("hidden");

        revealObserver.observe(element);

    });

});

// ==========================
// ACTIVE NAVIGATION
// ==========================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar ul li a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

// ==========================
// NAVBAR SCROLL EFFECT
// ==========================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});

// ==========================
// SMOOTH SCROLL
// ==========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (target) {

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});

// ==========================
// CURRENT YEAR IN FOOTER
// ==========================

const footer = document.querySelector("footer");

if (footer) {

    const year = new Date().getFullYear();

    footer.innerHTML =
        `© ${year} Abhijeet Patil | Unity Game Developer`;

}

console.log("Portfolio Loaded Successfully");