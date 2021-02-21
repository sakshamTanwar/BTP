import nodemailer from 'nodemailer';
import { PathLike } from 'fs';

export async function sendReport(reportFile: PathLike, toEmail: string) {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: toEmail,
        subject: 'Ownership History for Land',
        text: '',
        html: '',
        attachments: [
            {
                filename: 'Report.pdf',
                content: reportFile.toString(),
                contentType: 'application/pdf',
            },
        ],
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
