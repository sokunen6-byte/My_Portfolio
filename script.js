// ===== DOM Elements =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const modeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.mode-icon') : null;
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.portfolio-section');
const navTriggers = document.querySelectorAll('.nav-trigger');

// ===== Mobile Menu Toggle =====
if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

// ===== Smooth Scroll Navigation =====
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (navMenu) navMenu.classList.remove('active');
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section') || link.getAttribute('href').replace('#', '');
        scrollToSection(sectionId);
    });
});

navTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = trigger.getAttribute('data-section') || trigger.getAttribute('href').replace('#', '');
        scrollToSection(sectionId);
    });
});

// ===== Scroll Spy & Header Scroll Effect =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (header) {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    let currentSection = 'home';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        const linkTarget = link.getAttribute('data-section') || link.getAttribute('href').replace('#', '');
        if (linkTarget === currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// ===== Light/Dark Theme Toggle =====
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (modeIcon) modeIcon.textContent = '☀️';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLightTheme = document.body.classList.contains('light-theme');
        if (modeIcon) modeIcon.textContent = isLightTheme ? '☀️' : '🌙';
        localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    });
}

// ===== Telegram QR Code Modal =====
const telegramIconBtn = document.getElementById('telegramIconBtn');
const telegramQrModal = document.getElementById('telegramQrModal');
const closeQrModalBtn = document.getElementById('closeQrModalBtn');

function openTelegramModal(e) {
    if (e) e.preventDefault();
    if (telegramQrModal) {
        telegramQrModal.classList.add('active');
        telegramQrModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeTelegramModal() {
    if (telegramQrModal) {
        telegramQrModal.classList.remove('active');
        telegramQrModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

if (telegramIconBtn) {
    telegramIconBtn.addEventListener('click', openTelegramModal);
}

if (closeQrModalBtn) {
    closeQrModalBtn.addEventListener('click', closeTelegramModal);
}

if (telegramQrModal) {
    telegramQrModal.addEventListener('click', (e) => {
        if (e.target === telegramQrModal) {
            closeTelegramModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && telegramQrModal && telegramQrModal.classList.contains('active')) {
        closeTelegramModal();
    }
});

// ===== Ambient Rain Animation =====
(function initRainAnimation() {
    const canvas = document.getElementById('rainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let drops = [];
    let splashes = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const DROP_COUNT = Math.min(100, Math.max(40, Math.floor(window.innerWidth / 16)));
    const colorsDark = [
        'rgba(162, 155, 254, ',   // primary light (violet)
        'rgba(0, 206, 201, ',     // accent cyan
        'rgba(255, 102, 153, ',   // soft pink
        'rgba(129, 236, 236, '    // cyan light
    ];
    const colorsLight = [
        'rgba(108, 92, 231, ',
        'rgba(0, 150, 200, ',
        'rgba(232, 67, 147, '
    ];

    class Drop {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * (width + 100) - 50;
            this.y = initial ? Math.random() * height : -20 - Math.random() * 50;
            this.z = Math.random() * 0.8 + 0.2;
            this.length = (14 + Math.random() * 18) * this.z;
            this.speed = (7 + Math.random() * 9) * this.z;
            this.slant = 1.2 * this.z;
            this.opacity = (0.2 + Math.random() * 0.45) * this.z;
            this.colorIndex = Math.floor(Math.random() * colorsDark.length);
            this.thickness = this.z > 0.7 ? 1.5 : 1;
        }

        update() {
            this.x += this.slant;
            this.y += this.speed;

            if (this.y > height) {
                if (Math.random() < 0.3) {
                    createSplash(this.x, height - 2, this.colorIndex, this.opacity);
                }
                this.reset(false);
            }
        }

        draw(isLight) {
            const palette = isLight ? colorsLight : colorsDark;
            const colorPrefix = palette[this.colorIndex % palette.length];
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.slant * (this.length / this.speed), this.y + this.length);
            ctx.strokeStyle = colorPrefix + (isLight ? this.opacity * 0.8 : this.opacity) + ')';
            ctx.lineWidth = this.thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    function createSplash(x, y, colorIndex, opacity) {
        if (splashes.length > 25) return;
        splashes.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 3,
            vy: -(Math.random() * 2 + 1),
            radius: Math.random() * 1.5 + 0.8,
            alpha: opacity,
            colorIndex,
            life: 1
        });
    }

    for (let i = 0; i < DROP_COUNT; i++) {
        drops.push(new Drop());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        const isLight = document.body.classList.contains('light-theme');

        for (let i = 0; i < drops.length; i++) {
            drops[i].update();
            drops[i].draw(isLight);
        }

        for (let i = splashes.length - 1; i >= 0; i--) {
            const s = splashes[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.15;
            s.alpha -= 0.04;
            s.life -= 0.04;

            if (s.life <= 0 || s.alpha <= 0) {
                splashes.splice(i, 1);
            } else {
                const palette = isLight ? colorsLight : colorsDark;
                const colorPrefix = palette[s.colorIndex % palette.length];
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = colorPrefix + s.alpha + ')';
                ctx.fill();
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
// ===== Ethereal Glowing Comet & Smoke Cursor Animation =====
(function initMagicCursor() {
    let canvas = document.getElementById('cursorCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'cursorCanvas';
        canvas.className = 'cursor-canvas';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const mouse = {
        x: width / 2,
        y: height / 2,
        targetX: width / 2,
        targetY: height / 2,
        moving: false,
        speed: 0
    };

    let idleTimer = null;
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        mouse.moving = true;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            mouse.moving = false;
        }, 100);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.targetX = e.touches[0].clientX;
            mouse.targetY = e.touches[0].clientY;
            mouse.moving = true;
        }
    }, { passive: true });

    // Trail points for smooth ribbon tail
    const TRAIL_LENGTH = 26;
    const trail = [];
    for (let i = 0; i < TRAIL_LENGTH; i++) {
        trail.push({ x: mouse.x, y: mouse.y });
    }

    // Smoke and spark particles
    const particles = [];
    const MAX_PARTICLES = 70;

    class Particle {
        constructor(x, y, vx, vy) {
            this.x = x;
            this.y = y;
            this.vx = vx + (Math.random() - 0.5) * 2.2;
            this.vy = vy + (Math.random() - 0.5) * 2.2;
            this.radius = Math.random() * 8 + 3;
            this.alpha = Math.random() * 0.7 + 0.3;
            this.decay = Math.random() * 0.035 + 0.015;
            this.color = Math.random() > 0.4 ? '0, 242, 254' : '79, 172, 254'; // cyan & electric blue
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.95;
            this.vy *= 0.95;
            this.alpha -= this.decay;
            this.radius *= 0.97;
        }

        draw() {
            if (this.alpha <= 0 || this.radius <= 0.5) return;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
            gradient.addColorStop(0.5, `rgba(${this.color}, ${this.alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(${this.color}, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Smooth easing towards cursor position
        const dx = mouse.targetX - mouse.x;
        const dy = mouse.targetY - mouse.y;
        mouse.speed = Math.sqrt(dx * dx + dy * dy);
        mouse.x += dx * 0.28;
        mouse.y += dy * 0.28;

        // Emit smoke particles on movement
        if (mouse.speed > 1.2 && particles.length < MAX_PARTICLES) {
            const count = Math.min(3, Math.floor(mouse.speed / 4) + 1);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(
                    mouse.x + (Math.random() - 0.5) * 6,
                    mouse.y + (Math.random() - 0.5) * 6,
                    -dx * 0.08,
                    -dy * 0.08
                ));
            }
        }

        // Update trail points with fluid wave physics
        let prevX = mouse.x;
        let prevY = mouse.y;

        trail.forEach((point, i) => {
            const factor = 0.45 - (i / TRAIL_LENGTH) * 0.2;
            point.x += (prevX - point.x) * factor;
            point.y += (prevY - point.y) * factor;

            if (mouse.speed > 2) {
                point.x += Math.sin(Date.now() * 0.012 + i) * 0.9;
                point.y += Math.cos(Date.now() * 0.012 + i) * 0.9;
            }
            prevX = point.x;
            prevY = point.y;
        });

        // Draw smoke particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0 || particles[i].radius <= 0.5) {
                particles.splice(i, 1);
            }
        }

        // Draw glowing electric ribbon tail
        if (trail.length > 2) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            for (let i = 1; i < trail.length; i++) {
                const ratio = 1 - (i / trail.length);
                const width = Math.max(1, ratio * 14 * Math.min(1.5, Math.max(0.5, mouse.speed / 8)));
                const alpha = ratio * 0.75;

                // Outer cyan glow streak
                ctx.beginPath();
                ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
                ctx.lineTo(trail[i].x, trail[i].y);
                ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                ctx.lineWidth = width;
                ctx.lineCap = 'round';
                ctx.stroke();

                // Core white hot line
                ctx.beginPath();
                ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
                ctx.lineTo(trail[i].x, trail[i].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
                ctx.lineWidth = width * 0.35;
                ctx.stroke();
            }

            ctx.restore();
        }

        // Draw bright comet head orb
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Outer cyan glow
        const outerGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 26);
        outerGlow.addColorStop(0, 'rgba(0, 242, 254, 0.65)');
        outerGlow.addColorStop(0.4, 'rgba(79, 172, 254, 0.3)');
        outerGlow.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 26, 0, Math.PI * 2);
        ctx.fill();

        // Inner white-hot energy core
        const innerGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 9);
        innerGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
        innerGlow.addColorStop(0.5, 'rgba(0, 242, 254, 0.9)');
        innerGlow.addColorStop(1, 'rgba(79, 172, 254, 0)');
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        requestAnimationFrame(animate);
    }

    animate();
})();

// ===== Radial Orbital Language Menu Controller =====
(function initRadialLanguageMenu() {
    const statItem = document.getElementById('languagesStatItem');
    const orbitMenu = document.getElementById('languagesOrbitMenu');
    if (!statItem || !orbitMenu) return;

    let closeTimeout = null;
    let isMenuOpen = false;

    function openOrbitMenu() {
        clearTimeout(closeTimeout);
        statItem.classList.add('active');
        orbitMenu.classList.add('is-active');
        statItem.setAttribute('aria-expanded', 'true');
        isMenuOpen = true;
    }

    function closeOrbitMenu(immediate = false) {
        clearTimeout(closeTimeout);
        if (immediate) {
            statItem.classList.remove('active');
            orbitMenu.classList.remove('is-active');
            statItem.setAttribute('aria-expanded', 'false');
            isMenuOpen = false;
        } else {
            closeTimeout = setTimeout(() => {
                statItem.classList.remove('active');
                orbitMenu.classList.remove('is-active');
                statItem.setAttribute('aria-expanded', 'false');
                isMenuOpen = false;
            }, 260); // smooth buffer time so mouse movement is forgiving
        }
    }

    function toggleOrbitMenu(e) {
        if (e) e.stopPropagation();
        if (isMenuOpen) {
            closeOrbitMenu(true);
        } else {
            openOrbitMenu();
        }
    }

    // Mouse Hover / Hold Events
    statItem.addEventListener('mouseenter', () => {
        openOrbitMenu();
    });

    statItem.addEventListener('mouseleave', () => {
        closeOrbitMenu(false);
    });

    orbitMenu.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
    });

    orbitMenu.addEventListener('mouseleave', () => {
        closeOrbitMenu(false);
    });

    // Touch & Click Toggle (for mobile and tablet support)
    statItem.addEventListener('click', (e) => {
        // If clicking on an orbit item disc, let the item click handler execute
        if (e.target.closest('.radial-orbit-item')) return;
        toggleOrbitMenu(e);
    });

    // Keyboard Accessibility
    statItem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOrbitMenu(e);
        } else if (e.key === 'Escape' && isMenuOpen) {
            closeOrbitMenu(true);
            statItem.focus();
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !statItem.contains(e.target)) {
            closeOrbitMenu(true);
        }
    });

    // Orbital Items Click to Scroll to Skills Section with highlight
    const orbitItems = orbitMenu.querySelectorAll('.radial-orbit-item');
    orbitItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const langName = item.getAttribute('data-tooltip') || '';
            const skillsSection = document.getElementById('skills');
            if (skillsSection) {
                skillsSection.scrollIntoView({ behavior: 'smooth' });
                closeOrbitMenu(true);
            }
        });
    });
})();
// ===== Skill Progress Bar Animation on Scroll =====
(function initSkillBars() {
    const progressBars = document.querySelectorAll('.progress');
    if (!progressBars.length) return;

    if ('IntersectionObserver' in window) {
        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-width') || '0%';
                    bar.style.width = targetWidth;
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.2 });

        progressBars.forEach(bar => skillObserver.observe(bar));
    } else {
        // Fallback for older browsers
        progressBars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') || '0%';
        });
    }
})();

// ===== Contact Form & Copy Email Logic =====
(function initContactSection() {
    // Copy Email to Clipboard
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const textToCopy = copyEmailBtn.getAttribute('data-copy') || 'sokunen6@gmail.com';
            const tooltip = copyEmailBtn.querySelector('.copy-tooltip');
            
            const handleSuccess = () => {
                copyEmailBtn.classList.add('copied');
                if (tooltip) tooltip.textContent = 'Copied! ✨';
                setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                    if (tooltip) tooltip.textContent = 'Copy';
                }, 2200);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(handleSuccess).catch(() => {
                    // Fallback
                    const tempInput = document.createElement('input');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    handleSuccess();
                });
            } else {
                const tempInput = document.createElement('input');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                handleSuccess();
            }
        });
    }

    // Toast Notification helper
    const contactToast = document.getElementById('contactToast');
    let toastTimeout = null;

    function showContactToast(message = null) {
        if (!contactToast) return;
        if (message) {
            const msgEl = contactToast.querySelector('.toast-message');
            if (msgEl) msgEl.textContent = message;
        }
        clearTimeout(toastTimeout);
        contactToast.classList.add('show');
        toastTimeout = setTimeout(() => {
            contactToast.classList.remove('show');
        }, 4000);
    }

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn') || contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn ? submitBtn.innerHTML : '';
            const senderName = (document.getElementById('name') && document.getElementById('name').value.trim()) || 'there';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="btn-submit-content">
                        <span class="btn-text">Sending...</span>
                        <svg class="btn-send-icon spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="2" x2="12" y2="6"></line>
                            <line x1="12" y1="18" x2="12" y2="22"></line>
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                            <line x1="2" y1="12" x2="6" y2="12"></line>
                            <line x1="18" y1="12" x2="22" y2="12"></line>
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                    </span>
                `;
            }

            // Simulate smooth asynchronous dispatch
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = `
                        <span class="btn-submit-content">
                            <span class="btn-text">Message Sent!</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </span>
                    `;
                }

                showContactToast(`Thank you, ${senderName}! Your message has been received.`);
                contactForm.reset();

                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = originalContent;
                        submitBtn.disabled = false;
                    }
                }, 3000);
            }, 900);
        });
    }

    // ====================================================
    // ===== About Me Photo Hold / Touch Reveal ===========
    // ====================================================
    const aboutImageCard = document.getElementById('aboutImageCard');
    if (aboutImageCard) {
        aboutImageCard.addEventListener('touchstart', () => {
            aboutImageCard.classList.add('is-held');
        }, { passive: true });

        aboutImageCard.addEventListener('touchend', () => {
            aboutImageCard.classList.remove('is-held');
        }, { passive: true });

        aboutImageCard.addEventListener('touchcancel', () => {
            aboutImageCard.classList.remove('is-held');
        }, { passive: true });
    }
})();

// ====================================================
// ===== 3D Three.js Javascript Stars Background ======
// ====================================================
(function initPortfolioStars() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const universe = new THREE.Group();
    scene.add(universe);

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    // Procedural 4-Point Sparkling Star Texture
    function createSparkleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const center = 64;

        // Radial glow
        const radialGlow = ctx.createRadialGradient(center, center, 0, center, center, 60);
        radialGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
        radialGlow.addColorStop(0.12, 'rgba(255, 255, 255, 0.85)');
        radialGlow.addColorStop(0.35, 'rgba(255, 255, 255, 0.25)');
        radialGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radialGlow;
        ctx.fillRect(0, 0, 128, 128);

        // Horizontal cross flare
        const hGrad = ctx.createLinearGradient(0, center, 128, center);
        hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = hGrad;
        ctx.fillRect(0, center - 2, 128, 4);

        // Vertical cross flare
        const vGrad = ctx.createLinearGradient(center, 0, center, 128);
        vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(center - 2, 0, 4, 128);

        // Bright star core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(center, center, 3.5, 0, Math.PI * 2);
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
    }

    const starTexture = createSparkleTexture();

    // Vibrant Neon Colors Palette
    const starColors = [
        new THREE.Color('#ff007f'), // Magenta
        new THREE.Color('#ff1493'), // Deep Pink
        new THREE.Color('#00f0ff'), // Cyan
        new THREE.Color('#00ff66'), // Green
        new THREE.Color('#ffe600'), // Yellow
        new THREE.Color('#ff5500'), // Orange
        new THREE.Color('#a855f7'), // Purple
        new THREE.Color('#ffffff'), // White
        new THREE.Color('#38bdf8')  // Blue
    ];

    // Main 4-Point Stars Layer
    const starCount = 900;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 900;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 900;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1100;

        const c = starColors[Math.floor(Math.random() * starColors.length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 16,
        map: starTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        depthWrite: false
    });

    const starField = new THREE.Points(geometry, starMaterial);
    universe.add(starField);

    // Background Dust Layer
    const dustCount = 1500;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
        dustPos[i * 3] = (Math.random() - 0.5) * 1500;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 1500;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 1500;

        const c = starColors[Math.floor(Math.random() * starColors.length)];
        dustColors[i * 3] = c.r;
        dustColors[i * 3 + 1] = c.g;
        dustColors[i * 3 + 2] = c.b;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMaterial = new THREE.PointsMaterial({
        size: 2.2,
        transparent: true,
        opacity: 0.5,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const dustField = new THREE.Points(dustGeo, dustMaterial);
    universe.add(dustField);

    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth camera tilt
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
        camera.position.x = targetX;
        camera.position.y = -targetY;
        camera.lookAt(scene.position);

        // Rotation
        universe.rotation.y = elapsedTime * 0.02;
        universe.rotation.x = Math.sin(elapsedTime * 0.015) * 0.03;

        // Twinkle size modulation
        starMaterial.size = 15 + Math.sin(elapsedTime * 3) * 2.5;

        // Travel forward through space
        const posArray = starField.geometry.attributes.position.array;
        for (let i = 2; i < posArray.length; i += 3) {
            posArray[i] += 0.35;
            if (posArray[i] > 150) {
                posArray[i] = -900;
            }
        }
        starField.geometry.attributes.position.needsUpdate = true;

        dustField.rotation.y = elapsedTime * -0.01;

        renderer.render(scene, camera);
    }

    animate();

    // Window Resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
})();

