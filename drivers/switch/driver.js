const uuid = require('../../lib/uuid')
const RMDriver = require('../../lib/RMDriver')

class SwitchDriver extends RMDriver {
  createInitialCapabilities() {
    return {
      true: { id: 'true', name: 'on', command: null },
      false: { id: 'false', name: 'off', command: null },
    }
  }

  handleDone(data, callback) {
    callback(null, {
      name: 'Switch',
      data: {
        id: uuid(),
        deviceId: this.deviceId,
        commands: {
          true: this.capabilities.true.command,
          false: this.capabilities.false.command,
        },
      },
    })
  }
}

module.exports = SwitchDriver
