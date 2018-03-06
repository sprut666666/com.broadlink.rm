const uuid = require('../../lib/uuid')
const RMDriver = require('../../lib/RMDriver')

class CurtainsDriver extends RMDriver {
  createInitialCapabilities() {
    return {
      up: { id: 'up', name: 'Up', command: null },
      down: { id: 'down', name: 'Down', command: null },
      idle: { id: 'idle', name: 'Idle', command: null },
    }
  }

  handleDone(data, callback) {
    callback(null, {
      name: 'Curtains',
      data: {
        id: uuid(),
        deviceId: this.deviceId,
        commands: {
          up: this.capabilities.up.command,
          down: this.capabilities.down.command,
          idle: this.capabilities.idle.command,
        },
      },
    })
  }
}

module.exports = CurtainsDriver
