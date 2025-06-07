
let setDeviceCuidItem = function (cuid = '') {
    try {
        if (!cuid) return;
        if (!global.deviceIds[cuid] || global.deviceIds[cuid].endT < Date.now()) {
            global.deviceIds[cuid] = {
                startT: Date.now(),
                endT: Date.now() + 24 * 60 * 60 * 1000,
                status: 0,
            };
        };
        // console.log('setDeviceCuidItem:', global.deviceIds);
    } catch (error) {
        console.log('setDeviceCuidItem err:', error);
    }
};

let updateDeviceCuidStatus = function(status = 0, cuid = '') {
    if (!cuid) return;
    if (!global.deviceIds[cuid]) {
        setDeviceCuidItem(cuid)
    };
    global.deviceIds[cuid].status = status;
    // console.log('updateDeviceCuidStatus:', global.deviceIds);
}

// 清理过期的cuid记录
let clearDeviceIdsFn = function(time = 24 * 60 * 60 * 1000) {
    try {
        function runningFn() {
            if (global.deviceIds) {
                for (const deviceid in global.deviceIds) {
                    if (Object.hasOwnProperty.call(global.deviceIds, deviceid)) {
                        const deviceidItem = global.deviceIds[deviceid] || {};
                        if (deviceidItem.endT < Date.now()) {
                            delete global.deviceIds[deviceid];
                        }
                    }
                }
            } else {
                global.deviceIds = {};
            }
        };
        setInterval(_ => {
            runningFn();
        }, time);
        runningFn();
    } catch (error) {
        console.log('clearDeviceIdsFn err:', error);
    }
};

module.exports = {
    setDeviceCuidItem,
    clearDeviceIdsFn,
    updateDeviceCuidStatus
}