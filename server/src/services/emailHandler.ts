import nodemailer from "nodemailer"
import path from "path"

export class EmailHandler{
    
    private static service: string = 'gmail';
    private static user: string = 'email@gmail.com';
    private static pass: string = 'password';
    
    static async mailPdf(toUser: string, pdfName: string){
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: this.user,
              pass: this.pass
            }
        });

        let mailOptions = {
            from: this.user,
            to: toUser,
            subject: 'Requested Land Record',
            text: 'Please find attached the requested land record.',
            attachments: [{
                filename: 'file.pdf',
                path: path.join(__dirname,'..','..','temp', pdfName),
                contentType: 'application/pdf'
            }]
        }

        let info = await transporter.sendMail(mailOptions);

        return info;
    }

}

