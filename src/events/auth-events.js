const emailService = require("../services/email.service");

const sendOtp = (emailPayload) => {
    return sendEmail(emailPayload);
};

const sendResetLink = (emailPayload) => {
    return sendEmail(emailPayload);
};

const createUser = (emailPayload) => {
    return sendEmail(emailPayload);
};
const contactUser = (emailPayload) => {
    return sendEmail(emailPayload);
};

const notifyPasswordChanged = (emailPayload) => {
    return sendEmail(emailPayload);
};

const sendEmail = (payload) => {
    const service = new emailService();
    service.sendSMTPEmail(payload);
};

module.exports = {
    sendOtp,
    sendResetLink,
    createUser,
    contactUser,
    notifyPasswordChanged
};