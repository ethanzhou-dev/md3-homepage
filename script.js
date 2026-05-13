document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const navDrawer = document.getElementById('nav-drawer');
    const scrim = document.getElementById('scrim');
    const navItems = document.querySelectorAll('.md-nav-item[href^="#"]');

    function toggleMenu() {
        if(navDrawer && scrim) {
            navDrawer.classList.toggle('open');
            scrim.classList.toggle('open');
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
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
        document.body.className = document.body.className.replace(/lang-\w+/, 'lang-' + lang);
        if(rootHtml) rootHtml.setAttribute('lang', lang);
        
        if(lang === 'en') {
            if(btnEn) btnEn.classList.add('active');
            if(btnZh) btnZh.classList.remove('active');
            document.title = "Ekiz's Homepage";
        } else {
            if(btnZh) btnZh.classList.add('active');
            if(btnEn) btnEn.classList.remove('active');
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

    const launchDate = new Date(2026, 2, 26, 0, 0);
    function updateUptime() {
        const now = new Date();
        const diff = now - launchDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const uptimeElement = document.getElementById("uptime");
        if (uptimeElement) {
            uptimeElement.innerText = days + " days, " + hours + " hrs";
        }
    }
    updateUptime();
});
