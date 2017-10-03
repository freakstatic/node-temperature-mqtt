# A Temperature Monitor using Nodejs and MQTT
A PC temperature monitor that sends the reads using MQTT <br/>
Currently only supports CPU and Nvidia graphic temperatures <br/>

I'm using this to send the temperatures to the Home Assistant broker

### Prerequisites
 1 - NodeJS <br/>
 2 - Nvidia Graphic Drivers

In Windows you probably have to add this to your PATH variable

```bash
C:\Program Files\NVIDIA Corporation\NVSMI
```

An example of `configuration.yaml` for Home Assistant
```bash
  - platform: mqtt
    state_topic: 'computer/temperatures/cpu/0'
    name: 'CPU - Thread 0'
    unit_of_measurement: '  C'

  - platform: mqtt
    state_topic: 'computer/temperatures/cpu/1'
    name: 'CPU - Thread 1'
    unit_of_measurement: '  C'

  - platform: mqtt
    state_topic: 'computer/temperatures/cpu/2'
    name: 'CPU - Thread 2'
    unit_of_measurement: '  C'

  - platform: mqtt
    state_topic: 'computer/temperatures/cpu/3'
    name: 'CPU - Thread 3'
    unit_of_measurement: '  C'

  - platform: mqtt
    state_topic: 'computer/temperatures/cpu/4'
    name: 'CPU - Thread 4'
    unit_of_measurement: '  C'

  - platform: mqtt
    state_topic: 'computer/temperatures/cpu/5'
    name: 'CPU - Thread 5'
    unit_of_measurement: '  C'

  - platform: mqtt
    state_topic: 'computer/temperatures/graphic-card/1'
    name: 'Graphic Card'
    unit_of_measurement: '  C'
```
With some tweaks the result will be something like this :)

![alt text](https://raw.githubusercontent.com/freakstatic/node-temperature-mqtt/master/result.png)    
    
### Installation
Change the `config.json` file for your broker settings
```bash
$ npm install
```
### Usage
```bash
$ npm start
```
or
```bash
$ node index.js
```
