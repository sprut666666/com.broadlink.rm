let timeout = null
let closeClient = null
let getDataTimeout = null

let currentDevice

const stop = (log) => {
  // Reset existing learn requests
  if (closeClient) {
    closeClient()
    closeClient = null
  }
  if (currentDevice) {
    if (currentDevice.cancelRFSweep) {
      currentDevice.cancelRFSweep()
    }
    currentDevice = null
	}

  log('Learn (stopped)')
}

const start = (device, log, { progress, disableTimeout = false }) => {
  stop(log)

  if (!device) {
    return
  }
  if (!device.enterLearning) {
		return log(`Learn (learning not supported for device at ${host})`)
	}

	currentDevice = device

  let onRawData

  closeClient = (err) => {
    if (timeout) {
			clearTimeout(timeout)
		}
    timeout = null;

    if (getDataTimeout) {
			clearTimeout(getDataTimeout)
		}
    getDataTimeout = null

    currentDevice.removeListener('rawData', onRawData)
  }

  onRawData = (message) => {
    if (!closeClient) {
			return
		}

    const hex = message.toString('hex')		
		log(`Learn (complete)`)
    log(`[Hex Code: ${hex}]`)
		stop(log)
    progress({ stage: 'result', data: hex })
  }

  currentDevice.on('rawData', onRawData)

  currentDevice.enterLearning()
	log(`Learn (scanning)`)
	
	progress({ stage: 'start' })

  getDataTimeout = setTimeout(() => {
    getData(device)
  }, 1000)

  if (disableTimeout) {
		return
	}

  // Timeout the client after 10 seconds
  timeout = setTimeout(() => {
    log('Learn (10s timeout)')
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

  currentDevice.checkData()

  getDataTimeout = setTimeout(() => {
    getData(device)
  }, 1000)
}

module.exports = { start, stop }