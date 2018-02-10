const Homey = require('homey')

class ButtonDevice extends Homey.Device {
 onInit() {
    this.log('Button device init')
    this.log('name:', this.getName())
    this.log('class:', this.getClass())
    this.log('data:', this.getData())
    this.log('caps:', this.getCapabilities())
    
    this.data = this.getData()

    this.registerCapabilities()
  }

  registerCapabilities() {
    const capabilities = this.getCapabilities()
    capabilities.forEach(
      item => this.registerCapabilityListener(item, () => this.handleCapabilityTrigger(item))
    )
  }

  handleCapabilityTrigger(capability) {
    const deviceId = this.data.deviceId
    const command = this.data.commands[capability]
    Homey.app.brm.sendCommand(deviceId, command)
    return Promise.resolve()
  }
}

module.exports = ButtonDevice
