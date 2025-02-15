const Homey = require('homey')
const RMDevice = require('../../lib/RMDevice')

class ButtonDevice extends RMDevice {
  constructor(...args) {
    super(...args)
    this.type = 'Button'
  }

  handleCapabilityTrigger(capability) {
    const deviceId = this.data.deviceId
    const command = this.data.commands[capability]
    Homey.app.brm.sendCommand(deviceId, command)
    return Promise.resolve()
  }
}

module.exports = ButtonDevice
