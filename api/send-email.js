const nodemailer = require('../node_modules/nodemailer');
const express = require('../node_modules/express');
const bodyParser = require('../node_modules/body-parser');
const svgCaptcha = require('../node_modules/svg-captcha');
require('../node_modules/dotenv').config();
const router = express.Router();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    const {
        name,
        email,
        message
    } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    try {
        // await transporter.sendMail({
        //     from: process.env.EMAIL_USER,
        //     to: process.env.EMAIL_RECEIVER, // email penerima
        //     subject: `Message from ${name}`,
        //     text: `Email: ${email}\n\nMessage:\n${message}`,
        // });
        // res.status(200).json({
        //     message: 'Email sent successfully!'
        // });
    } catch (error) {
        console.error(error);
    }
}

// Rute untuk mendapatkan CAPTCHA
router.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create({
        size: 6,
        noise: 2,
        color: true,
        background: '#f9f9f9',
    });

    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});

app.post('/api/validate-captcha', (req, res) => {
    const userCaptcha = req.body.captcha;

    if (!userCaptcha) {
        return res.status(400).json({ success: false, message: 'CAPTCHA is required' });
    }

    if (userCaptcha === req.session.captcha) {
        return res.json({ success: true, message: 'CAPTCHA validated successfully' });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid CAPTCHA' });
    }
});