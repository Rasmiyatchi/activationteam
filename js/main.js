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
        if (typeof translations === 'undefined') return;
        const dict = translations[lang];
        if (!dict) return;

        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);

        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.innerHTML = dict[key];
        });

        i18nPhElements.forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (dict[key]) el.setAttribute('placeholder', dict[key]);
        });

        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // Apply saved or default language on load
    setLanguage(localStorage.getItem('lang') || 'uz');

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navLinks) {
        const toggleMenuIcon = (isOpen) => {
            const icon = mobileMenuBtn.querySelector('i');
            if (!icon) return;
            icon.classList.toggle('ph-list', !isOpen);
            icon.classList.toggle('ph-x', isOpen);
        };

        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            toggleMenuIcon(isOpen);
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggleMenuIcon(false);
            });
        });
    }

    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });


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

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const duration = 1800;
            let startTime = null;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                counter.innerText = Math.ceil(progress * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.innerText = target + '+';
                }
            };

            requestAnimationFrame(step);
            observer.unobserve(counter);
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // --- Form Submission (Using FormSubmit.co) ---
    const form = document.getElementById('contactForm');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            
            // UI feedback: Loading state
            btn.innerText = 'Yuborilmoqda...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            const formData = new FormData(this);
            const email = "odiljonsirojiddinov04@gmail.com";
            
            fetch(`https://formsubmit.co/ajax/${email}`, {
                method: "POST",
                body: formData,
                headers: { 
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server hatosi: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if(data.success === "true" || data.success === true) {
                    btn.innerText = 'Xabar yuborildi!';
                    btn.style.background = '#10b981';
                    form.reset();
                } else {
                    console.error('FormSubmit error:', data);
                    throw new Error(data.message || "Xatolik yuz berdi");
                }
            })
            .catch(error => {
                console.error('Submission error:', error);
                btn.innerText = 'Xatolik yuz berdi';
                btn.style.background = '#ef4444';
            })
            .finally(() => {
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = ''; 
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 4000);
            });
        });
    }

});
