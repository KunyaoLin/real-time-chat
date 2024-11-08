const nodemailer = require("nodemailer");
const ReactDOMServer = require("react-dom/server");
const { htmlToText } = require("html-to-text");
module.exports = class Email {
  constructor(username, url) {
    this.from = "realChat@gmail.com";
    this.to = username;
    this.url = url;
  }
  transporter() {
    if (process.env.NODE_MODE === "production") {
    } else {
      return nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
        secure: false,
        debug: true,
        logger: true,
      });
    }
  }
  async sendEmail(template, subject) {}
};
