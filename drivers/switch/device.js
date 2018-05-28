const Homey = require('homey')
const RMDevice = require('../../lib/RMDevice')

class SwitchDevice extends RMDevice {
  constructor(...args) {
    super(...args)
    this.type = 'Switch'
  }

  handleCapabilityTrigger(capability, value) {
    const deviceId = this.data.deviceId
    const command = this.data.commands[value]
    Homey.app.brm.sendCommand(deviceId, command)
    return Promise.resolve()
  }
}

module.exports = SwitchDevice
