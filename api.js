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
}]
