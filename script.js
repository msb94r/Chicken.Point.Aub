// ========================================
// CHICKEN POINT - SCRIPT JAVASCRIPT
// ========================================

// PRELOADER - Disparaît au chargement de la page
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }, 500);
    }
});

// MENU MOBILE - Toggle navigation
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Empêcher le scroll quand le menu est ouvert
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Fermer le menu quand on clique sur un lien
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// HEADER - Change de style au scroll
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Ajouter la classe "scrolled" après 50px de scroll
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// SMOOTH SCROLL pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorer les liens qui sont juste "#"
        if (href === '#' || href === '#!') {
            return;
        }

        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            // Calculer la position de la cible en tenant compte du header ET de la barre de nav sticky
            const headerHeight = document.getElementById('header').offsetHeight;
            const menuNavBar = document.getElementById('menu-nav-bar');
            let stickyNavHeight = 0;
            if (menuNavBar) {
                stickyNavHeight = menuNavBar.offsetHeight;
            }
            
            const totalOffset = headerHeight + stickyNavHeight + 20; // +20px de marge
            const targetPosition = target.offsetTop - totalOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ANIMATION AU SCROLL - Reveal elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer tous les éléments à animer
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-item, .menu-card, .menu-preview-card, .menu-item-card, .valeur-card, .timeline-item, .temoignage-card');
    
    animatedElements.forEach(el => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
    
    // COMPTEUR ANIMÉ pour les stats
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => statsObserver.observe(stat));

    // SWIPER BARRE DE MENU + SCROLLSPY
    const menuNavSwiper = document.getElementById('menu-nav-swiper');
    
    if (menuNavSwiper && typeof Swiper !== 'undefined') {
        
        const swiper = new Swiper(menuNavSwiper, {
            slidesPerView: 'auto', 
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
        });

        const sections = document.querySelectorAll('.menu-category');
        const navLinks = document.querySelectorAll('#menu-nav-swiper .swiper-slide a');
        
        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`#menu-nav-swiper a[href="#${id}"]`);
                    
                    if (activeLink) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        activeLink.classList.add('active');
                        const activeSlide = activeLink.closest('.swiper-slide');
                        if (activeSlide) {
                            swiper.slideTo(activeSlide.swiperSlideIndex, 300, false);
                        }
                    }
                }
            });
        }, { 
            rootMargin: '-150px 0px -50% 0px', 
            threshold: 0 
        });

        sections.forEach(section => scrollSpyObserver.observe(section));
    }

    // =======================================================
    // GESTION DES COOKIES (SINGLE BUTTON "OK")
    // =======================================================
    const cookieBanner = document.getElementById('cookie-banner');
    const ackBtn = document.getElementById('ack-cookies');

    // Vérifie si l'utilisateur a déjà cliqué sur OK
    if (!localStorage.getItem('cookieNoticeSeen')) {
        // Si pas de choix, on affiche la bannière avec un petit délai
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    // Clic sur OK
    if (ackBtn) {
        ackBtn.addEventListener('click', () => {
            localStorage.setItem('cookieNoticeSeen', 'true');
            cookieBanner.classList.remove('show');
        });
    }
});

// COMPTEUR ANIMÉ
const animateCounter = (element) => {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isPlus = target.includes('+');
    const number = parseInt(target.replace(/\D/g, ''));
    
    if (isNaN(number)) return;

    let current = 0;
    const increment = number / 50; 
    const duration = 1500; 
    const stepTime = duration / 50;

    const counter = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(counter);
        }
        
        let displayValue = Math.floor(current);
        if (isPercentage) displayValue += '%';
        if (isPlus && current >= number) displayValue += '+';
        else if (isPlus) displayValue += '+';
        
        element.textContent = displayValue;
    }, stepTime);
};

// =======================================================
// GESTION DU FORMULAIRE (AJAX + Reset)
// =======================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Empêche le rechargement de la page
        
        const status = document.getElementById("my-form-status");
        const button = contactForm.querySelector('button');
        const originalButtonText = button.textContent;
        
        // Petit effet de chargement
        button.textContent = "Envoi en cours...";
        button.disabled = true;

        const data = new FormData(event.target);

        try {
            const response = await fetch(event.target.action, {
                method: contactForm.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.innerHTML = "✅ Merci ! Votre message a bien été envoyé.";
                status.style.color = "#27ae60"; // Vert
                contactForm.reset(); // <--- C'EST ICI QUE LES CHAMPS SONT VIDÉS
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = "❌ " + data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "❌ Oups! Il y a eu un problème.";
                }
                status.style.color = "#E31E24"; // Rouge
            }
        } catch (error) {
            status.innerHTML = "❌ Oups! Il y a eu un problème de connexion.";
            status.style.color = "#E31E24"; // Rouge
        } finally {
            button.textContent = originalButtonText;
            button.disabled = false;
        }
    });
}

// LOG de bienvenue
console.log('%c🍗 CHICKEN POINT AUBERVILLIERS 🍗', 'color: #E31E24; font-size: 20px; font-weight: bold;');
document.body.classList.add('js-loaded');