const BroadlinkJS = require('broadlinkjs-rm')
const learn = require('./learn')

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
    learn.start(this.devices[mac], this.log, { progress })
  }

  stopRFLearning() {
    learn.stop(this.log)
  }

  sendCommand(mac, hexData) {
    const device = this.devices[mac]
    if (!device.sendData) {
      this.log(`[ERROR] The device at ${device.host.address} (${device.host.macAddress}) doesn't support the sending of IR or RF codes.`)
      return
    }
    if (hexData.includes('5aa5aa555')) {
      this.log('[ERROR] This type of hex code (5aa5aa555...) is no longer valid. Make the new learning to find new (decrypted) codes.')
      return
    }
    this.log(`sendHex (${device.host.address}; ${device.host.macAddress})`)
    const hexDataBuffer = new Buffer(hexData, 'hex')
    device.sendData(hexDataBuffer)
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
