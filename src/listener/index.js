const events = require("events");
const eventEmitter = new events.EventEmitter();
const {sendOtp, sendResetLink,createUser, notifyPasswordChanged} = require('@events');

eventEmitter.on('send-otp', sendOtp);
eventEmitter.on('send-reset-link', sendResetLink);
eventEmitter.on('create-user', createUser);
eventEmitter.on('notify-password-changed', notifyPasswordChanged);

module.exports = {
    emitter: eventEmitter
};