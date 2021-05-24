import nodemailer from 'nodemailer';
import path from 'path';
import { google } from 'googleapis';
require('dotenv').config();

export class EmailHandler {
    private static service: string = 'gmail';
    private static user: string = 'btp.lrsp@gmail.com';

    private static async createTransporter() {
        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            'https://developers.google.com/oauthplayground',
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        console.log(process.env.CLIENT_ID);
        const accessToken = await new Promise<string>((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport({
            service: this.service,
            auth: {
                type: 'OAuth2',
                user: this.user,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        return transporter;
    }

    static async mailPdf(toUser: string, fileName: string, pdfPath: string) {
        let transporter = await this.createTransporter();

        let mailOptions = {
            from: this.user,
            to: toUser,
            subject: 'Requested Land Record',
            text: 'Please find attached the requested land record.',
            attachments: [
                {
                    filename: fileName,
                    path: pdfPath,
                    contentType: 'application/pdf',
                },
            ],
        };

        let info = await transporter.sendMail(mailOptions);

        return info;
    }
}
