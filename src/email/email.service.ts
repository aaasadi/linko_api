import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as emailTemplate from 'email-templates';

@Injectable()
export class EmailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aaasadi.kh@gmail.com',
        pass: '264722227',
      },
    });
  }
  async sendEmail(option) {
    await this.transporter.sendMail(option);
  }
  async verifyEmail(email, verifyId) {
    const option = {
      to: email,
      from: 'me',
      subject: 'Register',
      html: `<a href="http://localhost:8000/verify/check/${verifyId}">Set Password</a>`,
    };
    await this.sendEmail(option);
  }
}
