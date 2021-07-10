
## Fan script for RaspberryPi

Small script to turn on and off the cpu fan according to temperature


## Install
```bash
npm i
```

## Usage
```bash
node run-fan.js
```

### Options
The following parameters can be changed in the code:
```javascript
const FAN_PIN = 18 // set GPIO pin number
const TEMP_THRESHOLD = 62 // cpu temperature to active the fan
const TEMP_CUTOFF = 55 // cpu temperature to turn off the fan
const CHECK_EVERY = 5 * 1000 // check temperature interval
```


## Run the script on device startup
``sudo nano /lib/systemd/system/fan-script.service``

copy and past this config (make sure to change some variables according to your environment)

```text
[Unit]
Description=run-fan.js - script for runing cpu fan accourding to temperature
After=

[Service]
Type=simple
#According to system user - RaspberryPi default is pi
User=pi
# change path to your fan-script project
ExecStart=/usr/bin/node /home/pi/fan-script/run-fan.js
Restart=on-failure

[Install]
WantedBy=multi-user.target

```
``sudo systemctl daemon-reload``

``sudo systemctl start fan-script``

``sudo systemtl enable fan-script``
