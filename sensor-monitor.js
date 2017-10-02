'use strict';
const exec = require('child-process-promise').exec;
const si = require('systeminformation');
module.exports = class SensorMonitor {
    static getProcessorTemps() {
        return new Promise((resolve, reject) => {
            si.cpuTemperature().then((data) => {
                resolve(data.cores);
            }).catch(error => reject(error));

        })
    };

    static getGraphicTemperatures() {
        return new Promise((resolve, reject) => {
            exec('nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader').then((result) => {

                if (result.stderr) {
                    reject(result.stderr);
                    return;
                }

                if (result.stdout){
                    return resolve(result.stdout.replace('\n', ''));
                }
            }).catch(error => reject(error));
        })
    };
};

