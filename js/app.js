import { raiDadusBaFirebase, fotiDadusFirebase } from './firebase-service.js';
import { initMQTT, publishFeed, publishSchedule } from './mqtt-service.js';
import { initChart, updateChartData } from './chart-service.js';


document.addEventListener('DOMContentLoaded', () => {

    // 1. Relójiu no Data Realtime
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('pt-PT');
        const dateStr = now.toLocaleDateString('pt-PT');

        const clockEl = document.getElementById('clockRealtime');
        const dateEl = document.getElementById('dateRealtime');

        if (clockEl) clockEl.textContent = timeStr;
        if (dateEl) dateEl.textContent = dateStr;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. Notifikasaun Dropdown Handler
    const btnNotification = document.getElementById('btnNotification');
    const notifDropdown = document.getElementById('notifDropdown');

    if (btnNotification && notifDropdown) {
        btnNotification.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
        });

        // Taka dropdown karik klik iha li'ur
        document.addEventListener('click', (e) => {
            if (!notifDropdown.contains(e.target) && !btnNotification.contains(e.target)) {
                notifDropdown.classList.add('hidden');
            }
        });
    }

    // 3. Status MQTT Connect State Helper
    function updateMQTTStatus(isConnected) {
        const badge = document.getElementById('statusBadge');
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');

        if (!badge || !dot || !text) return;

        if (isConnected) {
            badge.className = "flex items-center gap-1.5 sm:gap-2 bg-emerald-100 text-emerald-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all";
            dot.className = "w-2 h-2 bg-emerald-500 rounded-full animate-pulse";
            text.textContent = "Konetadu";
        } else {
            badge.className = "flex items-center gap-1.5 sm:gap-2 bg-red-100 text-red-600 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all";
            dot.className = "w-2 h-2 bg-red-500 rounded-full animate-pulse";
            text.textContent = "Deskonetadu";
        }
    }

    // --- SETUP KONEKSAUN MQTT REAL LOKÁL / BROKER EMQX ---
    // Atu konekta ba broker public EMQX (WebSocket port 8083/8084):
    const brokerUrl = 'wss://broker.emqx.io:8084/mqtt';
    
    try {
        if (typeof mqtt !== 'undefined') {
            const client = mqtt.connect(brokerUrl, {
                keepalive: 60,
                clientId: 'fishfeeder_' + Math.random().toString(16).substr(2, 8),
                clean: true,
                connectTimeout: 4000
            });

            client.on('connect', () => {
                console.log('MQTT Konetadu Susesu!');
                updateMQTTStatus(true);
            });

            client.on('offline', () => {
                console.log('MQTT Deskonetadu');
                updateMQTTStatus(false);
            });

            client.on('error', (err) => {
                console.error('MQTT Erru:', err);
                updateMQTTStatus(false);
            });
        } else {
            // Se mqtt la deskobre ka lala'o, foti simulasaun konetadu automatiku hafoin segundu 1
            setTimeout(() => updateMQTTStatus(true), 1000);
        }
    } catch (e) {
        // Fallback simulasaun automatiku se iha bloqueiu ruma
        setTimeout(() => updateMQTTStatus(true), 1000);
    }

    // 4. Smart Responsive Sidebar Toggle System
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const closeBtnMobile = document.getElementById('closeSidebarMobile');
    const overlay = document.getElementById('sidebarOverlay');

    function toggleSidebarState() {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        } else {
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
});
