const Homey = require('homey')
const BroadlinkRM = require('./lib/BroadlinkRM')

class App extends Homey.App {
  async onInit() {
    this.log('Broadlink RM server is running!')
    this.brm = new BroadlinkRM({ log: this.log })
    this.brm.discover()
  }
}

module.exports = App
