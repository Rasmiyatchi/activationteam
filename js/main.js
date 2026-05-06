window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hide');
        setTimeout(() => preloader.style.display = 'none', 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- Language Switcher ---
    const langBtns = document.querySelectorAll('.lang-btn');
    const i18nElements = document.querySelectorAll('[data-i18n]');
    const i18nPhElements = document.querySelectorAll('[data-i18n-ph]');

    function setLanguage(lang) {
        // translations is available from translations.js
        if(typeof translations === 'undefined') return;
        const dict = translations[lang];
        if(!dict) return;
        
        document.documentElement.lang = lang;

        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if(dict[key]) {
                el.innerHTML = dict[key]; 
            }
        });

        i18nPhElements.forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if(dict[key]) {
                el.setAttribute('placeholder', dict[key]);
            }
        });

        langBtns.forEach(btn => {
            btn.classList.remove('active');
            if(btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        }
    });

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        });
    });


    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- Scroll Animations (Intersection Observer) ---
    const fadeElements = document.querySelectorAll('.fade-up');

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });


    // --- Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;

                    // Lower inc to slow and higher to speed up
                    const inc = target / speed;

                    // Check if target is reached
                    if (count < target) {
                        // Add inc to count and output in counter
                        counter.innerText = Math.ceil(count + inc);
                        // Call function every ms
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target + '+';
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // --- Form Submission (Prevent Default for demo) ---
    const form = document.getElementById('contactForm');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.8';
            
            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.background = '#10b981'; // success green
                form.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = ''; // reset to default
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

});
