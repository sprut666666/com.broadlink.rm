module.exports = function parseDevices(devices) {
    return devices.map(device => ({
        id: device.host.macAddress,
        type: device.type,
        host: device.host,
    }));
}