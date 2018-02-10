let timeout = null
let closeClient = null
let getDataTimeout = null
let getDataTimeout2 = null
let getDataTimeout3 = null

let currentDevice

const stop = (log) => {
  // Reset existing learn requests
  if (closeClient) {
    closeClient()
    closeClient = null
  }
  if (currentDevice) {
    currentDevice.cancelRFSweep()
    currentDevice = null
  }

  log('Learn RF (stopped)')
}

const start = (device, log, { progress, disableTimeout = false } = {}) => {
  stop(log)

  if (!device) {
    return
  }
  if (!device.enterLearning) {
    return log(`Learn RF (IR learning not supported for device at ${device.host.address})`)
  }
  if (!device.enterRFSweep) {
    return log(`Learn RF (RF learning not supported for device at ${device.host.address})`)
  }

  currentDevice = device

  let onRawData
  let onRawData2
  let onRawData3

  closeClient = (err) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = null

    if (getDataTimeout) {
      clearTimeout(getDataTimeout)
    }
    getDataTimeout = null

    if (getDataTimeout2) {
      clearTimeout(getDataTimeout2)
    }
    getDataTimeout2 = null

    if (getDataTimeout3) {
      clearTimeout(getDataTimeout3)
    }
    getDataTimeout3 = null

    device.removeListener('rawRFData', onRawData)
    device.removeListener('rawRFData2', onRawData2)
    device.removeListener('rawData', onRawData3)
  };

  onRawData = (message) => {
    if (!closeClient) {
      return
    }

    if (getDataTimeout) {
      clearTimeout(getDataTimeout)
    }

    getDataTimeout = null

    log(`Learn RF (found frequency - 1 of 2)`)
    log(`[Keep holding that button!]`)

    getDataTimeout2 = setTimeout(() => {
      getData2(device)
    }, 1000)

    progress({ stage: 'step-1' })
  }

  onRawData2 = (message) => {
    if (!closeClient) {
      return
    }

    if (getDataTimeout2) {
      clearTimeout(getDataTimeout2)
    }

    getDataTimeout = null

    log(`Learn RF (found frequency - 2 of 2)`)
    log(`[Press the RF button multiple times with a pause between them]`);

    getDataTimeout3 = setTimeout(() => {
      getData3(device)
    }, 1000)

    progress({ stage: 'step-2' })
  }

  onRawData3 = (message) => {
    if (!closeClient) {
      return
    }

    const hex = message.toString('hex')
    log(`Learn RF (complete)`)
    log(`[Hex Code: ${hex}]`)
    stop(log)
    progress({ stage: 'result', data: hex })
  }

  device.on('rawRFData', onRawData)
  device.on('rawRFData2', onRawData2)
  device.on('rawData', onRawData3)

  device.enterRFSweep()
  log(`Learn RF (scanning)`)
  log(`[Hold down the button that sends the RF frequency]`)

  progress({ stage: 'start' })

  getDataTimeout = setTimeout(() => {
    getData(device)
  }, 1000)

  if (disableTimeout) {
    return
  }

  // Timeout the client after 20 seconds
  timeout = setTimeout(() => {
    log('Learn RF (10s timeout)')
    stop(log)

    progress({ stage: 'timeout' })
  }, 10 * 1000) // 10s
}

const getData = (device) => {
  if (getDataTimeout) {
    clearTimeout(getDataTimeout)
  }
  if (!closeClient) {
    return
  }

  device.checkRFData()

  getDataTimeout = setTimeout(() => {
    getData(device)
  }, 1000)
}

const getData2 = (device) => {
  if (getDataTimeout2) {
    clearTimeout(getDataTimeout2)
  }
  if (!closeClient) {
    return
  }

  device.checkRFData2();

  getDataTimeout2 = setTimeout(() => {
    getData2(device)
  }, 1000)
}

const getData3 = (device) => {
  if (getDataTimeout3) {
    clearTimeout(getDataTimeout3)
  }
  if (!closeClient) {
    return
  }

  device.checkData()

  getDataTimeout3 = setTimeout(() => {
    getData3(device)
  }, 1000)
}

module.exports = { start, stop }
