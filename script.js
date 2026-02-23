// ========== DRAGGING (Desktop Only) ==========
const menu     = document.getElementById('menu');
const titlebar = document.getElementById('titlebar');

let dragging = false;
let offsetX  = 0;
let offsetY  = 0;

// Only initialize dragging if we're not on mobile
const isMobile = () => window.innerWidth <= 800;

// Convert from CSS transform center to explicit pixel position
window.addEventListener('load', () => {
    if (!isMobile()) {
        const r = menu.getBoundingClientRect();
        menu.style.transform = 'none';
        menu.style.top  = r.top  + 'px';
        menu.style.left = r.left + 'px';
    }
});

titlebar.addEventListener('mousedown', (e) => {
    if (isMobile() || e.target.classList.contains('win-btn')) return;
    dragging = true;
    const r = menu.getBoundingClientRect();
    offsetX  = e.clientX - r.left;
    offsetY  = e.clientY - r.top;
    menu.style.transition = 'height 0.22s ease';
});

document.addEventListener('mousemove', (e) => {
    if (!dragging || isMobile()) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    x = Math.max(0, Math.min(window.innerWidth  - menu.offsetWidth,  x));
    y = Math.max(0, Math.min(window.innerHeight - menu.offsetHeight, y));
    menu.style.left = x + 'px';
    menu.style.top  = y + 'px';
});

document.addEventListener('mouseup', () => {
    dragging = false;
});

// Reset positioning if window resizes between desktop/mobile
window.addEventListener('resize', () => {
    if (isMobile()) {
        menu.style.transform = '';
        menu.style.top = '';
        menu.style.left = '';
    } else if (!menu.style.left) {
        // Switching back to desktop without drag position set
        menu.style.transform = 'translate(-50%, -50%)';
        menu.style.top = '50%';
        menu.style.left = '50%';
        setTimeout(() => {
            const r = menu.getBoundingClientRect();
            menu.style.transform = 'none';
            menu.style.top  = r.top  + 'px';
            menu.style.left = r.left + 'px';
        }, 50);
    }
});


// ========== TAB SWITCHING ==========
const tabs   = document.querySelectorAll('.tab[data-tab]');
const panels = document.querySelectorAll('.panel');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mobile-overlay');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t   => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
        
        // Close mobile menu if open when tab is clicked
        if (isMobile() && sidebar.classList.contains('open')) {
            closeMobileMenu();
        }
    });
});


// ========== MINIMIZE (Desktop Only) ==========
const btnMin    = document.getElementById('btn-min');
const menuBody  = document.getElementById('menu-body');
const statusbar = document.getElementById('statusbar');
let   minimized = false;

btnMin.addEventListener('click', () => {
    minimized = !minimized;
    menu.classList.toggle('collapsed', minimized);
    menuBody.style.display  = minimized ? 'none' : 'flex';
    statusbar.style.display = minimized ? 'none' : 'flex';
    btnMin.textContent      = minimized ? '▢' : '_';
});


// ========== PROJECT MODULE TOGGLE ==========
function toggleModule(el) {
    const wasOpen = el.classList.contains('open');
    el.classList.toggle('open', !wasOpen);
    el.querySelector('.mod-toggle').textContent = wasOpen ? '+' : '✓';
}


// ========== MOBILE MENU TOGGLE ==========
const menuToggle = document.getElementById('menu-toggle');

function openMobileMenu() {
    sidebar.classList.add('open');
    overlay.style.display = 'block';
    // Small timeout to allow display:block to apply before changing opacity
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
}

function closeMobileMenu() {
    sidebar.classList.remove('open');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300); // match CSS transition duration
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

overlay.addEventListener('click', closeMobileMenu);