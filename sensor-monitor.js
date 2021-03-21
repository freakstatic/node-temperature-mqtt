'use strict';
const {promisify} = require('util');
const exec = promisify(require('child_process').exec)
const si = require('systeminformation');
module.exports = class SensorMonitor {
    static getProcessorTemps() {
        return new Promise((resolve, reject) => {
            si.cpuTemperature().then((data) => {
                resolve(data.cores);
            }).catch(error => reject(error));

        })
    };

    static async getGraphicTemperatures() {
        try {
            let result = await exec('nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader');
            if (result.stdout) {
                let temperatures = result.stdout.split('\n');
                temperatures.pop();

                return temperatures;
            }
        }catch (error){
            console.error(error);
        }
        throw new Error('Unable to get graphic card temperature')
    };
};

