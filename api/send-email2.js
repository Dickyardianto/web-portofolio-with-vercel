const nodemailer = require('../node_modules/nodemailer');
require('../node_modules/dotenv').config();

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

    async function verifyRecaptcha(token) {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

        try {
            const response = await fetch(verifyUrl, {
                method: 'POST',
            });

            const data = await response.json();

            if (data.success) {
                console.log('reCAPTCHA berhasil diverifikasi');
                return true; // Token valid
            } else {
                console.log('reCAPTCHA gagal diverifikasi', data['error-codes']);
                return false; // Token tidak valid
            }
        } catch (error) {
            console.error('Error saat memverifikasi reCAPTCHA:', error);
            return false;
        }
    }

    exports.sendEmail = functions.https.onRequest(async (req, res) => {
        try {
            const isValid = await verifyRecaptcha(req.body.token);
            if (!isValid) {
                return res.status(400).send('reCAPTCHA verification failed');
            }
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_RECEIVER, // email penerima
                subject: `Message from ${name}`,
                text: `Email: ${email}\n\nMessage:\n${message}`,
            });
            res.status(200).send('Email sent successfully');
        }catch (error) {
            console.error("Error:", error);
            res.status(500).send('Internal Server Error');
        }
    });
}