document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = await grecaptcha.execute('6Lcji4oqAAAAAM3ps9eKbh8LBs2Mp2GMul4G6wmo', { action: 'submit' });
    const form = document.getElementById('contact-form');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.token = token;

    console.log(data);

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

    const response = await fetch('../api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        form.reset();
        showPopup('Terimakasih', 'Pesan anda sudah berhasil dikirim.');
    } else {
        showPopup('Gagal', 'Pesan anda gagal dikirim!.');
    }
});

function showPopup(title, message) {
    const popup = document.getElementById('customPopup');
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-message').innerText = message;
    popup.classList.remove('hidden');
}

function closePopup() {
    const popup = document.getElementById('customPopup');
    popup.classList.add('hidden');
}