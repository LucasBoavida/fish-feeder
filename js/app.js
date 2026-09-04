// 4. Smart Sidebar Toggle System (Desktop no Mobile)
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const closeBtnMobile = document.getElementById('closeSidebarMobile');
    const overlay = document.getElementById('sidebarOverlay');

    function toggleSidebarState() {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Iha Mobile: Slide tama/sai ho overlay
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        } else {
            // Iha Desktop: Hanehan kiko'in (Collapse/Hide) ka hatudu
            if (sidebar.classList.contains('md:w-0')) {
                sidebar.classList.remove('md:w-0', 'md:p-0', 'overflow-hidden');
                sidebar.classList.add('w-64', 'p-4');
            } else {
                sidebar.classList.remove('w-64', 'p-4');
                sidebar.classList.add('md:w-0', 'md:p-0', 'overflow-hidden');
            }
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebarState();
        });
    }

    if (closeBtnMobile) {
        closeBtnMobile.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }
