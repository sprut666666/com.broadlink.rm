const Homey = require('homey')
const parseDevice = require('./lib/parseDevice')

module.exports = [{
  method: 'GET',
  path: '/devices',
  fn(args, callback) {
    Homey.app.brm.discover()
    const devices = Homey.app.brm.getDevices()
    const data = devices.map(parseDevice)
    callback(null, data)
  }
}, {
  method: 'POST',
  path: '/devices/:id/learn/start',
  fn(args, callback) {
    Homey.app.brm.startRFLearning(args.params.id)
    callback(null)
  }
}, {
  method: 'POST',
  path: '/devices/:id/learn/stop',
  fn(args, callback) {
    Homey.app.brm.stopRFLearning(args.params.id)
    callback(null)
  }
}]
