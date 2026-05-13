document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const navDrawer = document.getElementById('nav-drawer');
    const scrim = document.getElementById('scrim');
    const navItems = document.querySelectorAll('.md-nav-item[href^="#"]');

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
        const uptimeElement = document.getElementById("uptime");
        const visitorElement = document.getElementById("visitor-count");
        
        try {
            const response = await fetch('/api/stats');
            if (response.ok) {
                const data = await response.json();
                if (uptimeElement) {
                    uptimeElement.innerText = `${data.uptime.days} days, ${data.uptime.hours} hrs`;
                }
                if (visitorElement) {
                    visitorElement.innerText = data.visitors;
                }
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
            if (uptimeElement) {
                uptimeElement.innerText = days + " days, " + hours + " hrs";
            }
            if (visitorElement) {
                visitorElement.innerText = "--";
            }
        }
    }
    fetchStats();
});
