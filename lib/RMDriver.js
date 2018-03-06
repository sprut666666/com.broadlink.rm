const Homey = require('homey')
const omit = require('lodash.omit')
const parseDevice = require('./parseDevice')

class RMDriver extends Homey.Driver {
  onPair(socket) {
    this.socket = socket
    this.deviceId = null
    this.currentId = null
    this.capabilities = this.createInitialCapabilities()
    socket.on('devices', this.handleDevices.bind(this))
    socket.on('devices:select', this.handleSelectDevice.bind(this))
    socket.on('devices:current', this.handleCurrentDevice.bind(this))
    socket.on('state', this.handleState.bind(this))
    socket.on('test', this.handleTestCommand.bind(this))
    socket.on('capability:add', this.handleAddCapability.bind(this))
    socket.on('capability:remove', this.handleRemoveCapability.bind(this))
    socket.on('capability:update', this.handleUpdateCapability.bind(this))
    socket.on('capability:current', this.handleCurrentCapability.bind(this))
    socket.on('learn:start', this.handleLearnStart.bind(this))
    socket.on('learn:stop', this.handleLearnStop.bind(this))
    socket.on('learn:result', this.handleLearnResult.bind(this))
    socket.on('done', this.handleDone.bind(this))
  }

  // Implement this method (optional)
  createCapability(data) {
    return data
  }

  // Implement this method (required)
  createInitialCapabilities() {
    return {}
  }

  addCapability(capability) {
    this.capabilities[capability.id] = capability
  }

  removeCapability(id) {
    this.capabilities = omit(this.capabilities, id)
  }

  updateCapability(capability) {
    this.capabilities[capability.id] = Object.assign(
      this.capabilities[capability.id],
      capability
    )
  }

  handleDevices(data, callback) {
    callback(null, {
      currentId: this.deviceId,
      devices: Homey.app.brm.getDevices().map(parseDevice)
    })
  }

  handleSelectDevice(data, callback) {
    this.deviceId = data.id
    callback()
  }

  handleCurrentDevice(data, callback) {
    callback(null, {
      device: parseDevice(Homey.app.brm.getDevice(this.deviceId))
    })
  }

  handleState(data, callback) {
    callback(null, {
      capabilities: Object.values(this.capabilities)
    })
  }

  handleLearnStart(data, callback) {
    if (data.type === 'learn') {
      Homey.app.brm.startLearning(this.deviceId, this.handleLearnProgress.bind(this))
      callback()
    } else if (data.type === 'learn_rfs') {
      Homey.app.brm.startRFSLearning(this.deviceId, this.handleLearnProgress.bind(this))
      callback()
    } else {
      callback(`Unknown learning type: ${data.type}`)
    }
  }

  handleLearnStop(data, callback) {
    if (data.type === 'learn') {
      Homey.app.brm.stopLearning(this.deviceId)
      callback()
    } else if (data.type === 'learn_rfs') {
      Homey.app.brm.stopRFSLearning(this.deviceId)
      callback()
    } else {
      callback(`Unknown learning type: ${data.type}`)
    }
  }

  handleTestCommand(data, callback) {
    Homey.app.brm.sendCommand(this.deviceId, data.hex)
    callback()
  }

  handleLearnResult(data, callback) {
    this.capabilities[this.currentId] = {
      ...this.capabilities[this.currentId],
      command: data.hex
    }
    callback()
  }

  handleLearnProgress({ stage, data }) {
    this.socket.emit('learn:progress', { stage, data })
  }

  handleAddCapability(data, callback) {
    const capability = this.createCapability({
      name: 'Button ' + (Object.keys(this.capabilities).length + 1)
    })
    this.addCapability(capability)
    callback(null, { capability })
  }

  handleRemoveCapability(data, callback) {
    this.removeCapability(data.id)
    callback()
  }

  handleUpdateCapability(data, callback) {
    this.updateCapability(data)
    callback()
  }

  handleCurrentCapability(data, callback) {
    this.currentId = data.id
    callback()
  }
  
  // Implement this method (required)
  handleDone(data, callback) {
    callback(null, device)
  }
}

module.exports = RMDriver
