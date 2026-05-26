// studdoc/static/studdoc/js/main.js

let modalElement = null;

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.profile-container')) {
        initProfilePage();
    }
});

function initProfilePage() {
    const requests = window.REQUESTS_DATA || [];
    createModal();

    document.querySelectorAll('.document-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            if (e.target.closest('.status-select')) return;
            const id = parseInt(item.dataset.id);
            const doc = requests.find(r => r.id == id);
            if (doc) showModal(doc);
        });
    });

    initProfileEditing();
}

function createModal() {
    if (document.getElementById('documentModal')) return;
    modalElement = document.createElement('div');
    modalElement.id = 'documentModal';
    modalElement.className = 'modal-overlay';
    modalElement.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div id="modalBody"></div>
        </div>
    `;
    document.body.appendChild(modalElement);

    const closeBtn = modalElement.querySelector('.close-modal');
    closeBtn.addEventListener('click', hideModal);
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) hideModal();
    });
}

async function showModal(doc) {
    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    // Показываем индикатор загрузки
    modalBody.innerHTML = '<div class="loading">Загрузка документа...</div>';
    modalElement.style.display = 'flex';

    try {
        const response = await fetch(`/api/request-preview/${doc.id}/`, {
            headers: { 'X-CSRFToken': window.DJANGO_DATA?.csrfToken || '' }
        });
        const data = await response.json();
        if (data.success) {
            modalBody.innerHTML = data.html;
        } else {
            modalBody.innerHTML = '<p class="error">Не удалось загрузить документ</p>';
        }
    } catch (err) {
        console.error(err);
        modalBody.innerHTML = '<p class="error">Ошибка соединения</p>';
    }
}

function hideModal() {
    if (modalElement) modalElement.style.display = 'none';
}

function initProfileEditing() {
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const viewDiv = document.querySelector('.user-details');
    const editDiv = document.getElementById('editForm');
    if (!editBtn) return;

    editBtn.addEventListener('click', () => {
        viewDiv.style.display = 'none';
        editDiv.style.display = 'block';
    });
    cancelBtn?.addEventListener('click', () => {
        viewDiv.style.display = 'block';
        editDiv.style.display = 'none';
    });
    saveBtn?.addEventListener('click', async () => {
    const username = document.getElementById('edit-username')?.value || '';
    const email = document.getElementById('edit-email')?.value || '';
    const last_name = document.getElementById('edit-last_name')?.value || '';
    const first_name = document.getElementById('edit-first_name')?.value || '';
    const patronymic = document.getElementById('edit-patronymic')?.value || '';
    const group = document.getElementById('edit-group')?.value || '';
    const faculty = document.getElementById('edit-faculty')?.value || '';
    const password = document.getElementById('edit-password')?.value || '';
    const confirm_password = document.getElementById('edit-confirm_password')?.value || '';

    if (password && password !== confirm_password) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }

    try {
        const response = await fetch('/profile/update/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.DJANGO_DATA?.csrfToken || '' },
            body: JSON.stringify({ username, email, last_name, first_name, patronymic, group, faculty, password })
        });
        const data = await response.json();
        if (response.ok && data.success) {
            // Обновляем отображение
            document.querySelector('.user-details h3').textContent = data.full_name;
            document.querySelector('.user-details p').innerHTML = `${data.group}, ${data.faculty}`;
            // Обновляем email в отображении, если есть
            const emailP = document.querySelector('.user-details p.email');
            if (emailP) emailP.textContent = `Email: ${data.email}`;
            viewDiv.style.display = 'block';
            editDiv.style.display = 'none';
            showNotification('Данные сохранены', 'success');
            // Обновляем глобальные данные
            window.DJANGO_DATA.userData = {
                name: data.full_name,
                group: data.group,
                faculty: data.faculty
            };
        } else {
            showNotification(data.message || 'Ошибка сохранения', 'error');
        }
    } catch (err) {
        showNotification('Ошибка соединения', 'error');
    }
});
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        setTimeout(() => notification.classList.remove('show'), 3000);
    }
}