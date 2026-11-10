// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);

    // Animate orbs on theme change
    document.querySelectorAll('.orb').forEach(orb => {
        orb.style.transition = 'background 0.6s ease, opacity 0.6s ease';
        orb.style.opacity = '0';
        setTimeout(() => { orb.style.opacity = '0.35'; }, 300);
    });
});

// ===== Custom Cursor — SVG Ring + Dot + Canvas Particle Trail =====
const cursorRing = document.getElementById('cursorRing');
const cursorDot = document.getElementById('cursorDot');
const cursorCanvas = document.getElementById('cursorCanvas');
const ambientGlow = document.getElementById('ambientGlow');
const ctx = cursorCanvas.getContext('2d');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let dotX = 0, dotY = 0;

// Particle trail storage
const particles = [];
const MAX_PARTICLES = 25;

function resizeCanvas() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Spawn trail particles
    if (particles.length < MAX_PARTICLES) {
        particles.push({
            x: mouseX,
            y: mouseY,
            life: 1,
            size: Math.random() * 3 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
});

function getAccentColor() {
    return getComputedStyle(html).getPropertyValue('--accent-1-rgb').trim();
}

function animateCursor() {
    // Ring — smooth follow
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';

    // Dot — snappy follow
    dotX += (mouseX - dotX) * 0.55;
    dotY += (mouseY - dotY) * 0.55;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';

    // Ambient glow — slow follow
    ambientGlow.style.left = ringX + 'px';
    ambientGlow.style.top = ringY + 'px';

    // Draw particle trail on canvas
    ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    const rgb = getAccentColor();

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.025;
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.98;

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.life * 0.3})`;
        ctx.fill();
    }

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover states
document.querySelectorAll('[data-cursor="pointer"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('hover');
        cursorDot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('hover');
        cursorDot.classList.remove('hover');
    });
});

document.addEventListener('mousedown', () => cursorRing.classList.add('click'));
document.addEventListener('mouseup', () => cursorRing.classList.remove('click'));

// ===== Card Glow Effect =====
document.querySelectorAll('.card-hover').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.setProperty('--glow-x', x + '%');
            glow.style.setProperty('--glow-y', y + '%');
        }
    });
});

// ===== Magnetic Buttons =====
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ===== Typewriter =====
const typewriterTexts = [
    "Information Science Engineer",
    "Deep Learning Enthusiast",
    "UI/UX Designer",
    "Problem Solver",
    "IEEE CS Member"
];
let textIndex = 0, charIndex = 0, isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function typewrite() {
    const currentText = typewriterTexts[textIndex];
    if (isDeleting) {
        typewriterEl.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === currentText.length) {
        speed = 2000; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typewriterTexts.length;
        speed = 500;
    }
    setTimeout(typewrite, speed);
}
typewrite();

// ===== Navbar =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const allSections = document.querySelectorAll('.section, .hero');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    allSections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
    });
    navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
});

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});
navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
    });
});

// ===== Counter Animation =====
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        const update = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        update();
    });
}

const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { animateCounters(); statsObserver.unobserve(e.target); }
    });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== Scroll Reveal =====
function setupScrollReveal() {
    const singles = document.querySelectorAll('.exp-card, .section-header, .tech-stack');
    singles.forEach(el => el.classList.add('reveal'));

    const grids = document.querySelectorAll(
        '.about-grid, .projects-grid, .cert-grid, .achievements-grid, .contact-info, .journey-items'
    );
    grids.forEach(g => {
        Array.from(g.children).forEach(c => c.classList.add('reveal-stagger'));
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    singles.forEach(el => obs.observe(el));

    const staggerObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.reveal-stagger').forEach((c, i) => {
                    setTimeout(() => c.classList.add('visible'), i * 100);
                });
                staggerObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
    grids.forEach(g => staggerObs.observe(g));
}

// ===== Journey Navigation =====
function setupJourney() {
    const btns = document.querySelectorAll('.journey-year-btn');
    const panels = document.querySelectorAll('.journey-panel');
    const connectors = document.querySelectorAll('.journey-connector');

    btns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            connectors.forEach((c, i) => c.classList.toggle('active', i < idx));

            panels.forEach(p => p.classList.remove('active'));
            const target = document.querySelector(`[data-panel="${btn.dataset.year}"]`);
            if (target) {
                target.classList.add('active');
                target.querySelectorAll('.journey-item').forEach((item, i) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(25px)';
                    setTimeout(() => {
                        item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, i * 100);
                });
            }
        });
    });
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    setupScrollReveal();
    setupJourney();
});
