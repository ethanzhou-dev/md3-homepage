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
                            targetEl.classList.add('visible', 'instant-visible');
                            setTimeout(() => {
                                targetEl.scrollIntoView();
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
        customElements.whenDefined('md-list'),
        customElements.whenDefined('md-list-item'),
        customElements.whenDefined('md-fab'),
        customElements.whenDefined('md-icon-button'),
        customElements.whenDefined('md-filled-tonal-button'),
        customElements.whenDefined('md-circular-progress')
    ]).then(markComponentsReady);

    window.addEventListener('load', markComponentsReady);
    setTimeout(markComponentsReady, 1500);

    const menuBtn = document.getElementById('menu-btn');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const navDrawer = document.getElementById('nav-drawer');
    const scrim = document.getElementById('scrim');
    const navItems = document.querySelectorAll('.md-nav-item[href^="#"]');
    const topAppBar = document.querySelector('.md-top-app-bar');


    let activeSeedColor = localStorage.getItem('themeSeedColor') || '#6750A4';
    let isDarkMode = document.documentElement.classList.contains('dark-theme');

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const customColorPicker = document.getElementById('custom-color-picker');
    const customColorWrapper = document.querySelector('.custom-color-wrapper');

    if (themeToggleIcon) {
        themeToggleIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
    }

    function updateThemeUI(hexColor) {
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

    function applyDynamicTheme(hexColor, isDark, savePreference = true) {
        if (savePreference) {
            const targetTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('themeSeedColor', hexColor);
            document.cookie = `themeSeedColor=${encodeURIComponent(hexColor)};path=/;max-age=31536000`;
            
            localStorage.setItem('preferredTheme', targetTheme);
            document.cookie = `preferredTheme=${targetTheme};path=/;max-age=31536000`;
        }

        const updateDOM = (newCss) => {
            if (isDark) {
                document.documentElement.classList.add('dark-theme');
                document.documentElement.classList.remove('light-theme');
            } else {
                document.documentElement.classList.add('light-theme');
                document.documentElement.classList.remove('dark-theme');
            }

            if (newCss) {
                const dynamicStyle = document.getElementById('dynamic-theme');
                if (dynamicStyle) {
                    dynamicStyle.innerHTML = newCss;
                }
            }

            activeSeedColor = hexColor;
            isDarkMode = isDark;

            if (themeToggleIcon) {
                themeToggleIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
            }
            updateThemeUI(hexColor);
        };

        const doUpdate = (newCss) => {
            if (document.startViewTransition) {
                document.startViewTransition(() => updateDOM(newCss));
            } else {
                updateDOM(newCss);
            }
        };

        if (activeSeedColor !== hexColor) {
            const cleanHex = hexColor.startsWith('#') ? hexColor.substring(1) : hexColor;
            fetch(`/api/theme?color=${cleanHex}`)
                .then(res => res.text())
                .then(css => {
                    doUpdate(css);
                })
                .catch(err => {
                    console.warn("Failed to fetch dynamic theme CSS:", err);
                    // Revert UI active color to previous if fetch fails (optional, but good practice)
                    // At minimum, don't break the UI
                });
        } else {
            doUpdate(null);
        }
    }

    const preloaderEl = document.getElementById('app-preloader');
    if (preloaderEl) {
        preloaderEl.style.backgroundColor = getComputedStyle(preloaderEl).backgroundColor;
    }

    updateThemeUI(activeSeedColor);
    themeReady = true;
    fadeOutLoader();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('preferredTheme')) {
            applyDynamicTheme(activeSeedColor, e.matches, false);
        }
    });

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            applyDynamicTheme(activeSeedColor, !isDarkMode);
        });
    }

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            applyDynamicTheme(color, isDarkMode);
        });
    });

    if (customColorPicker) {
        customColorPicker.addEventListener('change', (e) => {
            applyDynamicTheme(e.target.value, isDarkMode);
        });
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
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            
            const isMobileMenuOpen = window.innerWidth <= 840 && navDrawer.classList.contains('open');
            if (isMobileMenuOpen) {
                toggleMenu();
            }
            
            if (targetEl) {
                targetEl.classList.add('visible', 'instant-visible');
                if (isMobileMenuOpen) {
                    setTimeout(() => {
                        targetEl.scrollIntoView();
                    }, 320);
                } else {
                    targetEl.scrollIntoView();
                }
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
        const currentLang = localStorage.getItem('preferredLang') || document.documentElement.lang;
        if (currentLang === lang) return;
        
        localStorage.setItem('preferredLang', lang);
        document.cookie = `preferredLang=${lang};path=/;max-age=31536000`;
        
        document.documentElement.lang = lang;
        document.documentElement.classList.remove('lang-en', 'lang-zh');
        document.documentElement.classList.add('lang-' + lang);
        
        document.title = lang === 'zh' ? "Ekiz 的主页" : "Ekiz's Homepage";
    }

    if (btnEn && btnZh) {
        btnEn.addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });
        btnZh.addEventListener('click', (e) => { e.preventDefault(); setLanguage('zh'); });
    }



    const backToTopFab = document.getElementById('back-to-top-fab');
    const updateScrollState = () => {
        const scrolled = window.scrollY > 0;
        if (topAppBar) {
            topAppBar.classList.toggle('scrolled', scrolled);
        }
        if (backToTopFab) {
            backToTopFab.classList.toggle('visible', window.scrollY > 300);
        }
    };
    window.addEventListener('scroll', updateScrollState);
    updateScrollState();

    if (backToTopFab) {
        backToTopFab.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


});
