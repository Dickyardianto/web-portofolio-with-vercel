const nodemailer = require('../node_modules/nodemailer');
import svgCaptcha from 'svg-captcha';
require('../node_modules/dotenv').config();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {
            captchaText,
            captcha,
            name,
            email,
            message
        } = req.body;

        if (!captchaText || !captcha) {
            return res.status(400).json({
                success: false,
                message: 'CAPTCHA or session ID is required'
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', // atau gunakan SMTP server lain
            auth: {
                user: process.env.EMAIL_USER, // email pengirim
                pass: process.env.EMAIL_PASS, // password aplikasi email
            },
        });

        if (captchaText === captcha) {
            const newCaptcha = svgCaptcha.create({
                size: 6,
                noise: 2,
                color: true,
                background: '#f9f9f9',
            });
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_RECEIVER, // email penerima
                subject: `Message from ${name}`,
                text: `Email: ${email}\n\nMessage:\n${message}`,
            });
            return res.json({
                success: true,
                message: 'Email sent successfully!',
                newCaptcha: newCaptcha.data,
                captchaText: newCaptcha.text
            });
        } else {
            const newCaptcha = svgCaptcha.create({
                size: 6,
                noise: 2,
                color: true,
                background: '#f9f9f9',
            });
            return res.status(400).json({
                success: false,
                message: 'Invalid CAPTCHA',
                newCaptcha: newCaptcha.data,
                captchaText: newCaptcha.text
            });
        }
    } else {
        res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }
}