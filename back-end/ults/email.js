const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");
module.exports = class Email {
  constructor(user, url) {
    this.from = "realChat@gmail.com";
    this.to = user.email;
    this.user = user.username;
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
  async send(template, subject) {
    try {
      const html = pug.renderFile(`${__dirname}/../emailView/${template}.pug`, {
        username: this.user,
        url: this.url,
        subject,
      });
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        text: htmlToText(html),
        html,
      };
      await this.transporter().sendMail(mailOptions);
      console.log("Email sent successfully!!");
    } catch (err) {
      console.log("Email sent error");
    }
  }
  async sendWelcom() {
    await this.send("welcome", "Welcom to RealChat");
  }
  async sendPasswordForget() {
    await this.send(
      "forgetPassword",
      "Your password reset token only valid for 10 minutes"
    );
  }
};
