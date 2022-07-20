const nodemailer = require("nodemailer");
const ejs = require("ejs");
const { emailTemplate } = require("@models");
const path = require("path");

class EmailService {
  constructor() {
    this.model = emailTemplate;
    this.smtpEndpoint = process.env.MAIL_HOST;
    this.port = process.env.MAIL_PORT;
    this.senderAddress = process.env.MAIL_FROM_ADDRESS;
    this.smtpUsername = process.env.MAIL_USERNAME;
    this.smtpPassword = process.env.MAIL_PASSWORD;
  }

  async sendSMTPEmail(data) {
    try {
      let toAddresses = data.email;
      // let ccAddresses = "";
      // let bccAddresses = "";
      let template = await this.getTemplate(data);
      let subject = template.subject;
      const templateHtml = await ejs.renderFile(
        path.join(__dirname, "/../views/backend/email/send-mail.ejs"),
        { body: template.body }
      );
      console.log("templateHtml: ", templateHtml);
      let strHtml = templateHtml
        .replace("%username%", data.username)
        .replace("%token%", data.token)
        .replace("%otp_code%", data.otp_code)
        .replace("%url%", data.url)
        .replace("%password%", data.password);
      let body_text = template.subject;
      let body_html = strHtml;
      // let tag0 = data.code;
      // Create the SMTP transport.
      let transporter = nodemailer.createTransport({
        host: this.smtpEndpoint,
        port: this.port,
        secure: false, // true for 465, false for other ports
        auth: {
          user: this.smtpUsername,
          pass: this.smtpPassword,
        },
        logger: true,
        debug: true,
      });
      // Specify the fields in the email.
      let mailOptions = {
        from: this.senderAddress,
        to: toAddresses,
        subject: subject,
        text: body_text,
        html: body_html,
        // headers: {
        //     'X-SES-MESSAGE-TAGS': tag0
        // }
      };
      let info = await transporter.sendMail(mailOptions);
      console.log("Message sent! Message ID: ", info.messageId);
    } catch (e) {
      console.log("email error " + e.message);
      return;
    }
  }

  async getTemplate(data) {
    let emailTemplate = await this.model.findOne({
      where: { code: data.code },
    });
    return emailTemplate;
  }
}

module.exports = EmailService;
