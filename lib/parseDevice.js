module.exports = function parseDevice(device) {
    return {
        id: device.host.macAddress,
        type: device.type,
        host: device.host,
        learn: !!device.enterLearning, // Some devices have both IR and RF but support only one API
        learn_rfs: !!device.enterRFSweep,
    };
}