function request(method, url, data) {
  return new Promise((resolve, reject) => {
    Homey.api(method, url, data, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

class App extends React.Component {
  state = {
    devices: [],
  }

  componentDidMount() {
    this.loadDevices()
    this.interval = setInterval(() => this.loadDevices(), 3000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  async loadDevices() {
    this.setState({ devicesLoading: true })
    const devices = await request('GET', '/devices')
    this.setState({ devicesLoading: false, devices })
  }
  
  render() {
    return (
      <div>
        <h1>{t('settings.title')}</h1>
        <p>{t('settings.intro')}</p>

        <h2>{t('settings.devices_list')}</h2>
        <p>
          {t('settings.devices_list_info')}
          {this.state.devicesLoading && (
            <span className="fa fa-refresh fa-spin refresh"></span>
          )}
        </p>
        <Devices items={this.state.devices} />
      </div>
    )
  }
}

class Devices extends React.Component {
  getIcon(type) {
    switch(type) {
      case 'RM Mini':
        return 'icons/rm_mini.jpg'
      default:
        return 'icons/rm_pro.jpg'
    }
  }

  render() {
    return (
      <ul className="devices">
        {this.props.items.map(device => (
          <li className="device" id={device.id}>
            <img
              src={this.getIcon(device.type)}
              className="icon"
            />
            <div className="name">
              Broadlink {device.type}
            </div>
            <div className="info">
              <span className="text">
                {device.host.address}
              </span>
              <span className="text">
                {device.host.macAddress}
              </span>
            </div>
          </li>
        ))}
      </ul>
    )
  }
}

function onHomeyReady(Homey) {
  window.Homey = Homey
  window.t = Homey.__
  const rootElement = document.getElementById('app')
  ReactDOM.render(<App />, rootElement)
  Homey.ready()
}