import svgCaptcha from 'svg-captcha';
let sessionCaptcha = {};

export default function handler(req, res) {
    if (req.method === 'GET') {
        const captcha = svgCaptcha.create({
            size: 6,
            noise: 2,
            color: true,
            background: '#f9f9f9',
        });

        res.setHeader('Content-Type', 'image/svg+xml');
        res.status(200).json({
            captcha: captcha, // SVG data untuk CAPTCHA
        });
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

export { sessionCaptcha };
