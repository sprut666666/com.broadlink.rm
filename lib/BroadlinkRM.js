const BroadlinkJS = require('broadlinkjs-rm')
const learnRF = require('./learnRF')

const parseMac = mac => (
  (mac.toString('hex').match(/[\s\S]{1,2}/g) || []).join(':')
)

class BroadlinkRM {
  constructor({ log }) {
    this.log = log
    this.devices = []
    this.broadlink = new BroadlinkJS()
    this.broadlink.on('deviceReady', this.handleDeviceReady.bind(this))
  }

  discover() {
    this.broadlink.discover()
  }

  getDevices() {
    return Object.values(this.devices)
  }

  startRFLearning(mac, progress) {
    learnRF.start(this.devices[mac], this.log, { progress })
  }

  stopRFLearning() {
    learnRF.stop(this.log)
  }

  sendCommand(mac, hexData) {
    const device = this.devices[mac]
    if (!device.sendData) {
      this.log(`[ERROR] The device at ${device.host.address} (${device.host.macAddress}) doesn't support the sending of IR or RF codes.`)
      return
    }
    if (hexData.includes('5aa5aa555')) {
      this.log('[ERROR] This type of hex code (5aa5aa555...) is no longer valid. Use the included "Learn Code" accessory to find new (decrypted) codes.')
      return
    }

    const hexDataBuffer = new Buffer(hexData, 'hex')
    device.sendData(hexDataBuffer)

    this.log(`sendHex (${device.host.address}; ${device.host.macAddress})`)
  }

  handleDeviceReady(device) {
    device.host.macAddress = parseMac(device.mac)

    const prevDevices = this.devices[device.host.macAddress]

    if (prevDevices && prevDevices.host.address === device.host.address) {
      return
    }

    this.log(`Discovered Broadlink RM device at ${device.host.address} (${device.host.macAddress})`)

    this.devices[device.host.macAddress] = device
  }
}

module.exports = BroadlinkRM
