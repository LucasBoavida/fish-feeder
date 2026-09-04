import { raiDadusBaFirebase, fotiDadusFirebase } from './firebase-service.js';
import { initMQTT, publishFeed, publishSchedule } from './mqtt-service.js';
import { initChart, updateChartData } from './chart-service.js';

function updateRealtimeClock() {
    const clockEl = document.getElementById('clockRealtime');
    const dateEl = document.getElementById('dateRealtime');
    if (!clockEl || !dateEl) return;

    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString();
    dateEl.innerText = now.toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

function renderTable() {
    fotiDadusFirebase(10, (listData) => {
        const tabelaBody = document.getElementById('tabelaBody');
        if (!tabelaBody) return;
        
        tabelaBody.innerHTML = '';

        if (!listData || listData.length === 0) {
            tabelaBody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-slate-400">Seidauk iha dadus.</td></tr>';
            return;
        }

        listData.reverse().forEach((val) => {
            const dataHora = new Date(val.tempo).toLocaleString();
            let statusBadge = '<span class="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">Normál</span>';
            if (val.temperatura > 30) statusBadge = '<span class="bg-red-100 text-red-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">Manas</span>';
            if (val.temperatura < 22) statusBadge = '<span class="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">Malarin</span>';

            const row = `
                <tr class="hover:bg-slate-50 transition">
                    <td class="px-4 py-3 font-medium text-slate-700">${dataHora}</td>
                    <td class="px-4 py-3 font-mono text-slate-800">${val.temperatura} °C</td>
                    <td class="px-4 py-3 font-mono text-slate-800">${val.nivel_aihan} %</td>
                    <td class="px-4 py-3">${statusBadge}</td>
                </tr>
            `;
            tabelaBody.innerHTML += row;
        });

        const totalEl = document.getElementById('totalRecords');
        if (totalEl) totalEl.innerText = listData.length;
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // 1. Clock Timer
    setInterval(updateRealtimeClock, 1000);
    updateRealtimeClock();

    // 2. Init Components
    initChart('tempChart');
    renderTable();

    initMQTT(
        (data) => {
            if (data.temp !== undefined) {
                const tempEl = document.getElementById('tempVal');
                if (tempEl) tempEl.innerText = data.temp + ' °C';
                updateChartData(data.temp);

                const statusEl = document.getElementById('tempStatus');
                if (statusEl) {
                    if (data.temp > 30) {
                        statusEl.innerText = "Manas!";
                        statusEl.className = "text-xs font-semibold text-red-500";
                    } else if (data.temp < 22) {
                        statusEl.innerText = "Malarin!";
                        statusEl.className = "text-xs font-semibold text-blue-500";
                    } else {
                        statusEl.innerText = "Normál";
                        statusEl.className = "text-xs font-semibold text-emerald-500";
                    }
                }
            }

            if (data.food !== undefined) {
                const foodEl = document.getElementById('foodVal');
                const foodBar = document.getElementById('foodBar');
                if (foodEl) foodEl.innerText = data.food + ' %';
                if (foodBar) foodBar.style.width = data.food + '%';
            }

            if (data.temp !== undefined && data.food !== undefined) {
                raiDadusBaFirebase(data.temp, data.food, () => {
                    renderTable();
                });
            }
        },
        (isConnected) => {
            const badge = document.getElementById('statusBadge');
            if (badge) {
                if (isConnected) {
                    badge.className = "flex items-center gap-1.5 sm:gap-2 bg-emerald-100 text-emerald-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold";
                    badge.innerHTML = '<span class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span><span class="hidden sm:inline">Konetadu</span>';
                } else {
                    badge.className = "flex items-center gap-1.5 sm:gap-2 bg-red-100 text-red-600 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold";
                    badge.innerHTML = '<span class="w-2 h-2 bg-red-500 rounded-full"></span><span class="hidden sm:inline">Deskonetadu</span>';
                }
            }
        }
    );

    // 3. Servo Feed Action
    const btnFeed = document.getElementById('btnFeed');
    const servoStatus = document.getElementById('servoStatus');
    const servoDot = document.getElementById('servoDot');

    if (btnFeed) {
        btnFeed.addEventListener('click', () => {
            publishFeed();
            if (servoStatus && servoDot) {
                servoStatus.innerText = "Aberto (Loke)";
                servoStatus.className = "text-base font-bold text-emerald-600";
                servoDot.className = "w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping";

                setTimeout(() => {
                    servoStatus.innerText = "Fechado (Taka)";
                    servoStatus.className = "text-base font-bold text-slate-800";
                    servoDot.className = "w-2.5 h-2.5 bg-slate-400 rounded-full";
                }, 3000);
            }
        });
    }

    const btnSchedule = document.getElementById('btnSchedule');
    const btnRefresh = document.getElementById('btnRefreshTable');

    if (btnSchedule) {
        btnSchedule.addEventListener('click', () => {
            const s1 = document.getElementById('sched1').value;
            const s2 = document.getElementById('sched2').value;
            publishSchedule(s1, s2);
        });
    }
    if (btnRefresh) btnRefresh.addEventListener('click', renderTable);

    // 4. Sidebar Smooth Slide Function
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const closeBtnMobile = document.getElementById('closeSidebarMobile');
    const overlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
        if (sidebar) sidebar.classList.remove('-translate-x-full');
        if (overlay) overlay.classList.remove('hidden');
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.add('-translate-x-full');
        if (overlay) overlay.classList.add('hidden');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sidebar.classList.contains('-translate-x-full')) {
                openSidebar();
            } else {
                closeSidebar();
            }
        });
    }

    if (closeBtnMobile) closeBtnMobile.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Notifikasaun Dropdown
    const btnNotif = document.getElementById('btnNotification');
    const notifDropdown = document.getElementById('notifDropdown');

    if (btnNotif && notifDropdown) {
        btnNotif.onclick = function (e) {
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
        };

        document.onclick = function (e) {
            if (!notifDropdown.contains(e.target) && e.target !== btnNotif) {
                notifDropdown.classList.add('hidden');
            }
        };
    }
});
