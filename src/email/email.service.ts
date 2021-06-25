import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as pug from 'pug';
import * as path from 'path';

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
  async verifyEmail(email, user_id, verify_id) {
    const url: string = `http://localhost:8000/user/verify/${user_id}/${verify_id}`;
    const option = {
      to: email,
      from: 'me',
      subject: 'Verify Email',
      html: pug.renderFile(path.join(__dirname, '../../templates/verify.pug'), {
        url,
      }),
    };
    await this.sendEmail(option);
  }
  async recoveryEmail(email, id, verifyID) {
    const url: string = `http://localhost:3000/panel/reset_password?id=${id}&verify_id=${verifyID}`;
    const option = {
      to: email,
      from: 'me',
      subject: 'Recovery Email',
      html: pug.renderFile(
        path.join(__dirname, '../../templates/recovery.pug'),
        { url },
      ),
    };
    await this.sendEmail(option);
  }
}
