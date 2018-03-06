const Homey = require('homey')

class RMDevice extends Homey.Device {
 onInit() {
    this.log('RMDevice init:', this.type)
    this.log('name:', this.getName())
    this.log('class:', this.getClass())
    this.log('data:', this.getData())
    this.log('caps:', this.getCapabilities())
    
    this.data = this.getData()

    this.registerCapabilities()
  }

  registerCapabilities() {
    this.getCapabilities().forEach(
      capability => this.registerCapabilityListener(
        capability, this.handleCapabilityTrigger.bind(this, capability)
      )
    )
  }

  // Implement this method (required)
  handleCapabilityTrigger() {
    return Promise.resolve()
  }
}

module.exports = RMDevice
