const uuid = require('../../lib/uuid')
const RMDriver = require('../../lib/RMDriver')

class ButtonDriver extends RMDriver {
  createCapability(data = {}) {
    return {
      id: uuid(),
      name: data.name || 'Button',
      command: data.command || null
    }
  }

  createInitialCapabilities() {
    const capability = this.createCapability()
    return {
      [capability.id]: capability
    }
  }
  
  handleDone(data, callback) {
    const type = (item) => 'button.'+ item.id
    const caps = Object.values(this.capabilities)

    const capabilities = caps.map(type)
    const capabilitiesOptions = caps.reduce((result, item) => ({
      ...result,
      [type(item)]: { title: { en: item.name, nl: item.name } },
    }), {})

    // const components = caps.map(item => ({
    //   id: 'button',
    //   capabilities: [type(item)],
    //   options: { showTitle: true }
    // }))

    const components = [{
      id: 'icon',
		  options: { showTitle: true },
    }, {
      id: 'button',
      capabilities,
      options: { showTitle: true },
    }]

    const commands = caps.reduce((result, item) => ({
      ...result,
      [type(item)]: item.command,
    }), {})

    const deviceId = this.deviceId

    const device = {
      name: 'Device with buttons',
      data: {
        id: uuid(),
        deviceId,
        commands,
      },
      capabilities,
      capabilitiesOptions,
      mobile: { components }
    }
    callback(null, device)
  }
}

module.exports = ButtonDriver
