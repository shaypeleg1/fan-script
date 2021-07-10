const Gpio = require('onoff').Gpio;
const temp = require("pi-temperature");

const FAN_PIN = 18 // set GPIO pin number
const TEMP_THRESHOLD = 62 // cpu temperature to active the fan
const TEMP_CUTOFF = 55 // cpu temperature to turn off the fan
const CHECK_EVERY = 5 * 1000 // check temperature interval

const fan = new Gpio(FAN_PIN, 'out');

const getTemp = () => new Promise((resolve, reject) => temp.measure((err, temp) => {
    if (err) reject(err)
    else resolve(temp)
}))

const getCurrentFanStatus = () => new Promise((resolve, reject) =>
    fan.read((err, state) => {
        if (err) reject(err)
        resolve(state)
    })
)

const turnFanOn = async () => {
    const isFanOn = await getCurrentFanStatus();
    if (isFanOn) return
    await fan.write(1)
}

const turnFanOff = async () => {
    const isFanOn = await getCurrentFanStatus();
    if (!isFanOn) return
    await fan.write(0)
}

const fanInterval = setInterval(async () => {
    const currentTemp = await getTemp();
    if (currentTemp >= TEMP_THRESHOLD) {
        await turnFanOn()
    } else if (currentTemp <= TEMP_CUTOFF) {
        await turnFanOff()
    }
}, CHECK_EVERY)


process.on('SIGINT', async () => {
    clearInterval(fanInterval)
    await turnFanOff()
    fan.unexport();
});
