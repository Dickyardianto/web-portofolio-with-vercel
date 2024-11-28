async function fetchCaptcha() {
    const response = await fetch('/api/captcha');
    const data = await response.json();

    // Tampilkan CAPTCHA
    const captchaImage = document.getElementById('captcha-image');
    captchaImage.src = 'data:image/svg+xml;base64,' + btoa(data.captcha.data);

    // Simpan captchaText di localStorage
    localStorage.setItem('captchaText', data.captcha.text);
}

function generateSessionId() {
    return Math.random().toString(36).substr(2, 9); // Buat ID unik
}

document.getElementById('refresh-captcha').addEventListener('click', fetchCaptcha);
window.onload = fetchCaptcha;

document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = document.getElementById('contact-form');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    let isValid = true;
    // Reset pesan error
    document.querySelectorAll('.error-message').forEach((el) => {
        el.textContent = '';
    });

    // Validasi setiap field
    formData.forEach((value, key) => {
        const input = document.getElementById(key);
        const errorSpan = document.getElementById(`${key}-error`);

        if (!value.trim()) {
            isValid = false;
            input.classList.add('error'); // Tambahkan class error jika diperlukan
            errorSpan.textContent = 'This field is required'; // Pesan error
        } else {
            input.classList.remove('error');
        }
    });

    if (!isValid) {
        return; // Jika tidak valid, hentikan pengiriman
    }

    const captchaInput = document.getElementById('captcha').value;
    const captchaText = localStorage.getItem('captchaText');

    const response = await fetch('/api/validate-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captcha: captchaInput, captchaText, name : data.name, email : data.email, message : data.message }),
    });

    const result = await response.json();

    if (result.success) {
        form.reset();
        document.getElementById('captcha-image').src =
                'data:image/svg+xml;base64,' + btoa(result.newCaptcha);
        localStorage.setItem('captchaText', result.captchaText);
        showPopup('Terimakasih', 'Pesan anda sudah berhasil dikirim.');
    } else {
        document.getElementById('captcha-image').src =
                'data:image/svg+xml;base64,' + btoa(result.newCaptcha);
        localStorage.setItem('captchaText', result.captchaText);
        showPopup('Gagal', 'Pesan anda gagal dikirim!.');
    }
});

// function tampil popup
function showPopup(title, message) {
    const popup = document.getElementById('customPopup');
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-message').innerText = message;
    popup.classList.remove('hidden');
}

// function close
function closePopup() {
    const popup = document.getElementById('customPopup');
    popup.classList.add('hidden');
}