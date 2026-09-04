let tempChart = null;

export function initChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperatura (°C)',
                data: [],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: '#f1f5f9' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

export function updateChartData(tempValue) {
    if (!tempChart) return;
    const now = new Date().toLocaleTimeString();
    if (tempChart.data.labels.length > 8) {
        tempChart.data.labels.shift();
        tempChart.data.datasets[0].data.shift();
    }
    tempChart.data.labels.push(now);
    tempChart.data.datasets[0].data.push(tempValue);
    tempChart.update();
}
