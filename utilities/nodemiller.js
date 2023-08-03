const nodmiller = require("nodemailer");
const pug = require("pug");

class Email {
  constructor(userEmail, subject, body) {
    this.transport = nodmiller.createTransport({
      host: `${process.env.SMTP_HOST}`,
      port: 587,
      auth: {
        user: `${process.env.SMTP_USERNAME}`,
        pass: `${process.env.SMTP_PASSWORD}`,
      },
    });

    this.userEmail = userEmail;
    this.subject = subject;
    this.body = body;
  }

  async sendConfirmEmail() {
    let message = {
      from: "ourapp@ourapp.com",
      to: this.userEmail,
      subject: "Confirm Email",
      html: pug.renderFile(`${__dirname}/views/confirmEmail.pug`, {
        firstName: this.userEmail,
        url: "ourapp@ourapp.com",
        subject: "Confirm Email",
      }),
    };

    await this.transport
      .sendMail(message)
      .then(() => console.log("sent confirm email"))
      .catch((err) => console.log(err));
  }
  async sendResetPasswordEmail() {
    let message = {
      from: "ourapp@ourapp.com",
      to: this.userEmail,
      subject: "Reset Password",
      body: `You can reset your password from that Link https://confirmEmail.com`,
    };
    await this.transport
      .sendMail(message)
      .then(() => console.log("sent confirm email"))
      .catch((err) => console.log(err));
  }
  async sendEmail() {
    let message = {
      from: "ourapp@ourapp.com",
      to: this.userEmail,
      subject: this.subject,
      body: this.body,
    };
    await this.transport
      .sendMail(message)
      .then(() => console.log("sent confirm email"))
      .catch((err) => console.log(err));
  }
}

module.exports = Email;
