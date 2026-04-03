import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }

    async sendOtp(email: string, otp: string) {
        const mailOptions = {
            from: '"ExpenseApp" <no-reply@expenseapp.com>',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
            html: `<b>Your OTP code is ${otp}.</b><p>It will expire in 10 minutes.</p>`,
        };

        try {
            // For development, if SMTP is not configured, just log to console
            if (!this.configService.get('SMTP_HOST')) {
                console.log('--- DEV: MOCK EMAIL SEND ---');
                console.log(`To: ${email}`);
                console.log(`OTP: ${otp}`);
                console.log('-----------------------------');
                return;
            }
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email sending failed', error);
        }
    }
}
