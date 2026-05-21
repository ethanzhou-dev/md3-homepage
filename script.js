document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-enabled');
    const menuBtn = document.getElementById('menu-btn');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const navDrawer = document.getElementById('nav-drawer');
    const scrim = document.getElementById('scrim');
    const navItems = document.querySelectorAll('.md-nav-item[href^="#"]');

    let colorUtils = null;
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

    async function applyDynamicTheme(hexColor, isDark) {
        activeSeedColor = hexColor;
        localStorage.setItem('themeSeedColor', hexColor);

        if (!colorUtils) {
            try {
                colorUtils = await import("https://esm.sh/@material/material-color-utilities");
            } catch (e) {
                console.error("Failed to load material-color-utilities CDN", e);
                return;
            }
        }

        const utils = colorUtils;
        const argb = utils.argbFromHex(hexColor);
        const theme = utils.themeFromSourceColor(argb);
        const hex = utils.hexFromArgb;
        const n = theme.palettes.neutral;
        const nv = theme.palettes.neutralVariant;
        const p = theme.palettes.primary;
        const s = theme.palettes.secondary;
        const t = theme.palettes.tertiary;
        const err = theme.palettes.error;

        const vars = {};
        if (isDark) {
            vars['--md-sys-color-primary'] = hex(p.tone(80));
            vars['--md-sys-color-on-primary'] = hex(p.tone(20));
            vars['--md-sys-color-primary-container'] = hex(p.tone(30));
            vars['--md-sys-color-on-primary-container'] = hex(p.tone(90));
            
            vars['--md-sys-color-secondary'] = hex(s.tone(80));
            vars['--md-sys-color-on-secondary'] = hex(s.tone(20));
            vars['--md-sys-color-secondary-container'] = hex(s.tone(30));
            vars['--md-sys-color-on-secondary-container'] = hex(s.tone(90));
            
            vars['--md-sys-color-tertiary'] = hex(t.tone(80));
            vars['--md-sys-color-on-tertiary'] = hex(t.tone(20));
            vars['--md-sys-color-tertiary-container'] = hex(t.tone(30));
            vars['--md-sys-color-on-tertiary-container'] = hex(t.tone(90));

            vars['--md-sys-color-error'] = hex(err.tone(80));
            vars['--md-sys-color-on-error'] = hex(err.tone(20));
            vars['--md-sys-color-error-container'] = hex(err.tone(30));
            vars['--md-sys-color-on-error-container'] = hex(err.tone(90));

            vars['--md-sys-color-background'] = hex(n.tone(6));
            vars['--md-sys-color-on-background'] = hex(n.tone(90));
            
            vars['--md-sys-color-surface'] = hex(n.tone(6));
            vars['--md-sys-color-on-surface'] = hex(n.tone(90));
            vars['--md-sys-color-surface-variant'] = hex(nv.tone(30));
            vars['--md-sys-color-on-surface-variant'] = hex(nv.tone(80));
            
            vars['--md-sys-color-surface-container-lowest'] = hex(n.tone(4));
            vars['--md-sys-color-surface-container-low'] = hex(n.tone(10));
            vars['--md-sys-color-surface-container'] = hex(n.tone(12));
            vars['--md-sys-color-surface-container-high'] = hex(n.tone(17));
            vars['--md-sys-color-surface-container-highest'] = hex(n.tone(22));
            
            vars['--md-sys-color-outline'] = hex(nv.tone(60));
            vars['--md-sys-color-outline-variant'] = hex(nv.tone(30));
        } else {
            vars['--md-sys-color-primary'] = hex(p.tone(40));
            vars['--md-sys-color-on-primary'] = hex(p.tone(100));
            vars['--md-sys-color-primary-container'] = hex(p.tone(90));
            vars['--md-sys-color-on-primary-container'] = hex(p.tone(10));
            
            vars['--md-sys-color-secondary'] = hex(s.tone(40));
            vars['--md-sys-color-on-secondary'] = hex(s.tone(100));
            vars['--md-sys-color-secondary-container'] = hex(s.tone(90));
            vars['--md-sys-color-on-secondary-container'] = hex(s.tone(10));
            
            vars['--md-sys-color-tertiary'] = hex(t.tone(40));
            vars['--md-sys-color-on-tertiary'] = hex(t.tone(100));
            vars['--md-sys-color-tertiary-container'] = hex(t.tone(90));
            vars['--md-sys-color-on-tertiary-container'] = hex(t.tone(10));

            vars['--md-sys-color-error'] = hex(err.tone(40));
            vars['--md-sys-color-on-error'] = hex(err.tone(100));
            vars['--md-sys-color-error-container'] = hex(err.tone(90));
            vars['--md-sys-color-on-error-container'] = hex(err.tone(10));

            vars['--md-sys-color-background'] = hex(n.tone(98));
            vars['--md-sys-color-on-background'] = hex(n.tone(10));
            
            vars['--md-sys-color-surface'] = hex(n.tone(98));
            vars['--md-sys-color-on-surface'] = hex(n.tone(10));
            vars['--md-sys-color-surface-variant'] = hex(nv.tone(90));
            vars['--md-sys-color-on-surface-variant'] = hex(nv.tone(30));
            
            vars['--md-sys-color-surface-container-lowest'] = hex(n.tone(100));
            vars['--md-sys-color-surface-container-low'] = hex(n.tone(96));
            vars['--md-sys-color-surface-container'] = hex(n.tone(94));
            vars['--md-sys-color-surface-container-high'] = hex(n.tone(92));
            vars['--md-sys-color-surface-container-highest'] = hex(n.tone(90));
            
            vars['--md-sys-color-outline'] = hex(nv.tone(50));
            vars['--md-sys-color-outline-variant'] = hex(nv.tone(80));
        }

        let cssText = '';
        for (const [key, val] of Object.entries(vars)) {
            document.documentElement.style.setProperty(key, val);
            cssText += `${key}: ${val}; `;
        }
        localStorage.setItem('themeStyles', cssText);

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

    applyDynamicTheme(activeSeedColor, isDarkMode);

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
        document.documentElement.className = 'lang-' + lang;
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
            const launchDate = new Date(2026, 2, 26, 0, 0);
            const now = new Date();
            const diff = now - launchDate;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const uptimeText = `${days} days, ${hours} hrs`;
            uptimeElements.forEach(el => el.innerText = uptimeText);
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

    document.querySelectorAll('.md-card').forEach(card => {
        cardObserver.observe(card);
    });
});
