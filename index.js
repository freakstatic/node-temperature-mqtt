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

let client  = mqtt.connect(config.mqtt.host, options);

client.on('connect', () => {
    console.log('Connected to broker on ' + config.mqtt.host + ':' + config.mqtt.port);
    let oldCpuTemperatures = [];
    let oldGraphiCardTempeature = 0;
    let intervalCpuTemps = setInterval(()=> {
            SensorMonitor.getProcessorTemps().then((temperatures) => {
                temperatures.forEach((temperature, index) => {
                    if (oldCpuTemperatures[index] !== temperature){
                        if (config.log){
                            console.log('CPU Thread ' + index + ': ' + temperature)
                        }
                        oldCpuTemperatures[index] = temperature;
                        client.publish('computer/temperatures/cpu/' + index, "" + temperature);
                    }
                })

            }).catch((error) => {
                clearInterval(intervalCpuTemps);
                console.error(error);
            });

        SensorMonitor.getGraphicTemperatures().then((temperature) => {
                if (oldGraphiCardTempeature !== temperature){
                    if (config.log) {
                        console.log('Graphic card: ' + temperature);
                    }
                    client.publish('computer/temperatures/graphic-card', temperature);
                    oldGraphiCardTempeature = temperature;
                }
            }).catch((error) => {
                clearInterval(intervalCpuTemps);
                console.error(error);
            });
        }, config.interval);
});

client.on('close', () => {
    console.error('Unable to connect with broker');
});

client.on('error', (error) => {
    console.error('The following error has occurred ' + error);
});

