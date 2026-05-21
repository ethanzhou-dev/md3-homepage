document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-enabled');

    let themeReady = !!localStorage.getItem('themeStyles');
    let componentsReady = false;

    const fadeOutLoader = () => {
        if (!themeReady || !componentsReady) return;
        const preloader = document.getElementById('app-preloader');
        const container = document.querySelector('.layout-container');
        if (preloader && !preloader.classList.contains('fade-out')) {
            document.documentElement.classList.add('app-loaded');

            if (container) {
                container.style.transition = 'none';
                container.style.opacity = '1';
            }

            preloader.classList.add('fade-out');

            setTimeout(() => {
                const cards = document.querySelectorAll('.md-card');
                const cardObserverOptions = {
                    root: null,
                    rootMargin: '0px 0px -8% 0px',
                    threshold: 0.05
                };

                const cardObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, cardObserverOptions);

                let viewportCardCount = 0;
                cards.forEach((card) => {
                    const rect = card.getBoundingClientRect();
                    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
                    if (inViewport) {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, viewportCardCount * 80);
                        viewportCardCount++;
                    } else {
                        cardObserver.observe(card);
                    }
                });

                if (window.location.hash) {
                    try {
                        const targetId = decodeURIComponent(window.location.hash.substring(1));
                        const targetEl = document.getElementById(targetId);
                        if (targetEl) {
                            setTimeout(() => {
                                targetEl.scrollIntoView({ behavior: 'smooth' });
                            }, viewportCardCount * 80 + 100);
                        }
                    } catch (e) {
                        console.error("Failed to scroll to hash target:", e);
                    }
                }
            }, 200);

            setTimeout(() => {
                preloader.remove();
            }, 600);
        }
    };

    const markComponentsReady = () => {
        componentsReady = true;
        fadeOutLoader();
    };

    Promise.all([
        customElements.whenDefined('md-nav-drawer'),
        customElements.whenDefined('md-list'),
        customElements.whenDefined('md-list-item'),
        customElements.whenDefined('md-fab'),
        customElements.whenDefined('md-icon-button')
    ]).then(markComponentsReady);

    window.addEventListener('load', markComponentsReady);
    setTimeout(markComponentsReady, 1500);

    const menuBtn = document.getElementById('menu-btn');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const navDrawer = document.getElementById('nav-drawer');
    const scrim = document.getElementById('scrim');
    const navItems = document.querySelectorAll('.md-nav-item[href^="#"]');


    let activeSeedColor = localStorage.getItem('themeSeedColor') || '#6750A4';
    let isDarkMode = localStorage.getItem('preferredTheme') === 'dark' || 
                     (!localStorage.getItem('preferredTheme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const customColorPicker = document.getElementById('custom-color-picker');
    const customColorWrapper = document.querySelector('.custom-color-wrapper');

    function initThemeMode() {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.remove('light-theme');
            if (themeToggleIcon) themeToggleIcon.textContent = 'light_mode';
        } else {
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
            if (themeToggleIcon) themeToggleIcon.textContent = 'dark_mode';
        }
    }
    initThemeMode();

    async function applyDynamicTheme(hexColor, isDark, skipIfCached) {
        activeSeedColor = hexColor;
        localStorage.setItem('themeSeedColor', hexColor);

        // Fetch pre-computed CSS variables from Edge API
        let cssText = '';
        try {
            const hexParam = hexColor.replace('#', '');
            const response = await fetch(`/api/theme?color=${hexParam}&dark=${isDark}`);
            if (response.ok) {
                const data = await response.json();
                cssText = data.css;
            } else {
                throw new Error("Theme API failed");
            }
        } catch (e) {
            console.error("Failed to load theme from API", e);
            return;
        }

        const cachedStyles = localStorage.getItem('themeStyles');
        if (skipIfCached && cachedStyles === cssText) {
        } else {
            document.documentElement.style.cssText = cssText;
            localStorage.setItem('themeStyles', cssText);
        }
        themeReady = true;
        fadeOutLoader();

        let foundPreset = false;
        presetBtns.forEach(btn => {
            if (btn.getAttribute('data-color').toLowerCase() === hexColor.toLowerCase()) {
                btn.classList.add('active');
                foundPreset = true;
            } else {
                btn.classList.remove('active');
            }
        });

        if (customColorWrapper) {
            if (foundPreset) {
                customColorWrapper.classList.remove('active');
            } else {
                customColorWrapper.classList.add('active');
                if (customColorPicker) customColorPicker.value = hexColor;
            }
        }
    }

    const preloaderEl = document.getElementById('app-preloader');
    if (preloaderEl) {
        preloaderEl.style.backgroundColor = getComputedStyle(preloaderEl).backgroundColor;
        const spinnerEl = preloaderEl.querySelector('.preloader-spinner');
        if (spinnerEl) {
            const spinnerStyles = getComputedStyle(spinnerEl);
            spinnerEl.style.borderColor = spinnerStyles.borderColor;
            spinnerEl.style.borderTopColor = spinnerStyles.borderTopColor;
        }
    }

    applyDynamicTheme(activeSeedColor, isDarkMode, true);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('preferredTheme')) {
            isDarkMode = e.matches;
            initThemeMode();
            applyDynamicTheme(activeSeedColor, isDarkMode);
        }
    });

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem('preferredTheme', isDarkMode ? 'dark' : 'light');
            initThemeMode();
            applyDynamicTheme(activeSeedColor, isDarkMode);
        });
    }

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            applyDynamicTheme(color, isDarkMode);
        });
    });

    if (customColorPicker) {
        const handleCustomColor = (e) => {
            const color = e.target.value;
            applyDynamicTheme(color, isDarkMode);
        };
        customColorPicker.addEventListener('input', handleCustomColor);
        customColorPicker.addEventListener('change', handleCustomColor);
    }

    function toggleMenu() {
        if(navDrawer && scrim) {
            navDrawer.classList.toggle('open');
            scrim.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', toggleMenu);
    if (scrim) scrim.addEventListener('click', toggleMenu);
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 840 && navDrawer.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    const sections = document.querySelectorAll('.md-card[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    const btnEn = document.getElementById('btn-lang-en');
    const btnZh = document.getElementById('btn-lang-zh');
    const rootHtml = document.getElementById('html-root');

    function setLanguage(lang) {
        Array.from(document.documentElement.classList).forEach(c => {
            if (c.startsWith('lang-')) {
                document.documentElement.classList.remove(c);
            }
        });
        document.documentElement.classList.add('lang-' + lang);
        if(rootHtml) rootHtml.setAttribute('lang', lang);
        
        if(lang === 'en') {
            document.title = "Ekiz's Homepage";
        } else {
            document.title = "Ekiz 的主页";
        }
        
        localStorage.setItem('preferredLang', lang);
    }

    if (btnEn && btnZh) {
        btnEn.addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });
        btnZh.addEventListener('click', (e) => { e.preventDefault(); setLanguage('zh'); });
    }

    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang && userLang.toLowerCase().startsWith('zh')) {
            setLanguage('zh');
        }
    }

    async function fetchStats() {
        const uptimeElements = document.querySelectorAll(".stat-uptime");
        const visitorElements = document.querySelectorAll(".stat-visitor");
        
        try {
            const response = await fetch('/api/stats');
            if (response.ok) {
                const data = await response.json();
                const uptimeText = `${data.uptime.days} days, ${data.uptime.hours} hrs`;
                uptimeElements.forEach(el => el.innerText = uptimeText);
                visitorElements.forEach(el => el.innerText = data.visitors);
            } else {
                throw new Error('API fetch failed');
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
            uptimeElements.forEach(el => el.innerText = "Unavailable");
            visitorElements.forEach(el => el.innerText = "--");
        }
    }
    fetchStats();

    const backToTopFab = document.getElementById('back-to-top-fab');
    if (backToTopFab) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopFab.classList.add('visible');
            } else {
                backToTopFab.classList.remove('visible');
            }
        });
        backToTopFab.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


});
