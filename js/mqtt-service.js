
import { mqttConfig } from './config.js';

let client = null;

export function initMQTT(onMessageReceived, onStatusChange) {
    const connectUrl = `wss://${mqttConfig.host}:${mqttConfig.port}/mqtt`;

    client = mqtt.connect(connectUrl, {
        clientId: 'TailAdminWeb_' + Math.random().toString(16).substr(2, 8),
        username: mqttConfig.username,
        password: mqttConfig.password,
        clean: true,
        reconnectPeriod: 2000
    });

    client.on('connect', () => {
        onStatusChange(true);
        client.subscribe('fishfeeder/status/sensors');
    });

    client.on('message', (topic, message) => {
        if (topic === 'fishfeeder/status/sensors') {
            try {
                const data = JSON.parse(message.toString());
                onMessageReceived(data);
            } catch (e) {
                console.error("JSON Error:", e);
            }
        }
    });

    client.on('close', () => {
        onStatusChange(false);
    });
}

export function publishFeed() {
    if (client && client.connected) {
        client.publish('fishfeeder/cmd/feed', 'FEED');
    } else {
        alert("MQTT Broker Seidauk Konekta!");
    }
}

export function publishSchedule(s1, s2) {
    if (client && client.connected) {
        const payload = JSON.stringify({ feed1: s1, feed2: s2 });
        client.publish('fishfeeder/cmd/schedule', payload, { retain: true });
        alert("Oráriu haruka tiha ona ba ESP32!");
    } else {
        alert("MQTT Broker Seidauk Konekta!");
    }
}
