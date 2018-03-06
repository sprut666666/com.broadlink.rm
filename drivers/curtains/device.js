const Homey = require('homey')
const RMDevice = require('../../lib/RMDevice')

class CurtainsDevice extends RMDevice {
  constructor(...args) {
    super(...args)
    this.type = 'Curtains'
  }

  handleCapabilityTrigger(capability, value) {
    const deviceId = this.data.deviceId
    const command = this.data.commands[value]
    Homey.app.brm.sendCommand(deviceId, command)
    return Promise.resolve()
  }
}

module.exports = CurtainsDevice
