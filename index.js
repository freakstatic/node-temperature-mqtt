'use strict';

const config = require('./config');
const SensorMonitor = require('./sensor-monitor.js');

let mqtt = require('mqtt');

let options = {
    port: config.mqtt.port,
    clientId: config.mqtt.clientId.trim().length ? config.mqtt.clientId : 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: config.mqtt.username,
    password: config.mqtt.password,
};

let client = mqtt.connect(config.mqtt.host, options);

client.on('connect', () => {
    console.log('Connected to broker on ' + config.mqtt.host + ':' + config.mqtt.port);
    let oldCpuTemperatures = [];
    let oldGraphiCardTempeatures = [];
    let intervalCpuTemps = setInterval(async () => {
        try {
            let cpuTemps = await SensorMonitor.getProcessorTemps();
            cpuTemps.forEach((temperature, index) => {
                if (!oldCpuTemperatures[index] || oldCpuTemperatures[index] !== temperature) {
                    if (config.log) {
                        console.log('CPU Thread ' + index + ': ' + temperature)
                    }
                    oldCpuTemperatures[index] = temperature;
                    client.publish('computer/temperatures/cpu/' + index, "" + temperature);
                }
            });

            let graphicTemperatures = await SensorMonitor.getGraphicTemperatures();
            graphicTemperatures.forEach((temperature, index) => {
                if (!oldGraphiCardTempeatures[index] || oldGraphiCardTempeatures[index] !== temperature) {
                    if (config.log) {
                        console.log('Graphic card ' + index + ': ' + temperature);
                    }
                    client.publish('computer/temperatures/graphic-card/' + index, temperature);
                    oldGraphiCardTempeatures = temperature;
                }
            });
        } catch (error) {
            console.error(error);
        }
    }, config.interval);
});

client.on('close', () => {
    console.error('Unable to connect with broker');
});

client.on('error', (error) => {
    console.error('The following error has occurred ' + error);
});

