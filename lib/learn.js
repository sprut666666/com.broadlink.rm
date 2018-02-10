const learnRF = require('./learnRF')
const learnIR = require('./learnIR')

let timeout = null

function processResult(progress, callback) {
  return function processedProgress(data) {
    if (data.stage === 'result') {
      clearTimeout(timeout)
      callback(data)
    }
    progress(data)
  }
}

function start(device, log, { progress, disableTimeout = false }) {
  learnRF.start(device, log, {
    progress: processResult(progress, () => learnIR.stop(log)),
    disableTimeout: true,
  })
  learnIR.start(device, log, {
    progress: processResult(progress, () => learnRF.stop(log)),
    disableTimeout: true,
  })

  if (disableTimeout) {
    return
  }

  timeout = setTimeout(() => {
    log('Learn (10s timeout)')
    learnRF.stop(log)
    learnIR.stop(log)

    progress({ stage: 'timeout' })
	}, 10 * 1000) // 10s
}

function stop(log) {
  clearTimeout(timeout)
  learnRF.stop(log)
  learnIR.stop(log)
}

module.exports = { start, stop }
