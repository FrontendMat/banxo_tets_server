const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            logger: false,
            debug: false,
            secureConnection: false,
            auth: {
                user: process.env.SMTP_NAME,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: true
            }
        })
    }

    async sendActivationMail(mail, link) {
        console.log(mail)
        await this.transporter.sendMail({
            from: process.env.SMTP_NAME,
            to: mail,
            subject: 'Login ',
            text: 'Rocket',
            html:
                `
                    <div>
                        <h1 style="text-align: center">Для підтвердження реєстрації перейдіть за посиланням нижче:</h1>
                        <p style="
                        text-align: center; 
                        color: #f2f3f4;
                        font-size: 14px;
                        font-weight: bold;
                        ">
                            ${link} 
                        </p>
                    </div>
                `
        })
    }
}

module.exports = new MailService();