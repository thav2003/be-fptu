const nodemailer = require("nodemailer");
const { htmlToText } = require("html-to-text");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
// module export Email
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[1];
    this.url = url;
    this.from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // // 1. render html based on a pug template
    // const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
    //   firstName: this.firstName,
    //   url: this.url,
    //   subject,
    // });

    // 2. define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      //html,
      //text: htmlToText(html),
    };
    // 3. create a transport and send mail
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the FPTU HCM Family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
