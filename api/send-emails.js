const nodemailer = require('nodemailer');
require('dotenv').config();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    const {
        name,
        email,
        message,
        token
    } = req.body;

    if (!name || !email || !message || !token) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    // Verifikasi reCAPTCHA token
    const fetch = require('node-fetch'); 
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Tambahkan di .env
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    console.log(token);;
    // Konfigurasi transporter Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // atau gunakan SMTP server lain
        auth: {
            user: process.env.EMAIL_USER, // email pengirim
            pass: process.env.EMAIL_PASS, // password aplikasi email
        },
    });

    try {
        const captchaResponse = await fetch(verificationURL, { method: 'POST' });
        const captchaData = await captchaResponse.json();

        console.log(captchaData);

        if (!captchaData.success) {
            return res.status(400).json({ error: 'Captcha validation failed' });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_RECEIVER, // email penerima
            subject: `Message from ${name}`,
            text: `Email: ${email}\n\nMessage:\n${message}`,
        });

        res.status(200).json({
            message: 'Email sent successfully!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to send email'
        });
    }
}