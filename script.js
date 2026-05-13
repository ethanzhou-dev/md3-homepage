
document.addEventListener('DOMContentLoaded', () => {
    // Drawer Logic
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
    
    // Close drawer when clicking a link (mobile)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 840 && navDrawer.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Uptime Logic
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
