// studdoc/static/studdoc/js/form-handlers.js

export function initFormSubmit() {
    const form = document.getElementById('requestForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('/api/create-request/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': window.DJANGO_DATA.csrfToken
                },
                body: formData
            });

            if (response.ok) {
                showNotification('Заявка успешно отправлена!', 'success');
                setTimeout(() => {
                    window.location.href = '/profile/';
                }, 1500);
            } else {
                const error = await response.json();
                showNotification(error.error || 'Ошибка при отправке', 'error');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showNotification('Ошибка соединения', 'error');
        }
    });
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}