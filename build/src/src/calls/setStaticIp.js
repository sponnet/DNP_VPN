const db = require('../db');
const dyndnsClient = require('../dyndnsClient');
const loginMsg = require('../loginMsg');
const {eventBus, eventBusTag} = require('../eventBus');

async function setStaticIp({staticIp}) {
    const oldStaticIp = await db.get('staticIp');
    await db.set('staticIp', staticIp);

    // loginMsg must be rewritten to reflect the staticIp change
    await loginMsg.write();

    // Parse action to display a feedback message
    let message;
    if (!oldStaticIp && staticIp) {
        message = `Enabled static IP: ${staticIp}`;
    } else if (oldStaticIp && !staticIp) {
        message = `Disabled static IP`;
        // If the staticIp is being disabled but there is no keys: register to dyndns
        if (!await db.get('registeredToDyndns')) {
            await dyndnsClient.updateIp();
            message += `, and registered to dyndns: ${await db.get('domain')}`;
        }
    } else {
        message = `Updated static IP: ${staticIp}`;
    }

    // Emit packages update
    eventBus.emit(eventBusTag.emitDevices);

    return {
      message,
      logMessage: true,
      userAction: true,
    };
}


module.exports = setStaticIp;
