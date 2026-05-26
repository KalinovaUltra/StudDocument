import DocumentModalComponent from './view/document-modal-component.js';

let requestsData = [];
let modalComponent = null;

export function initProfcom() {
    requestsData = window.PROFCOM_DATA || [];
    modalComponent = new DocumentModalComponent();
    renderRequests();
    document.getElementById('searchInput')?.addEventListener('input', renderRequests);
    document.getElementById('statusFilter')?.addEventListener('change', renderRequests);
}

async function showRequestModal(requestId) {
    try {
        const response = await fetch(`/api/request-preview/${requestId}/`);
        const data = await response.json();
        if (data.success) {
            const modalBody = document.querySelector('#documentModal #modalBody');
            if (modalBody) {
                modalBody.innerHTML = data.html;
                modalComponent.modal.style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function renderRequests() {
    const container = document.getElementById('requestsContainer');
    if (!container) return;

    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';

    let filtered = requestsData.filter(req => {
        const matchSearch = req.student_name.toLowerCase().includes(searchTerm);
        const matchStatus = statusFilter === 'all' || req.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Заявок не найдено</p></div>';
        return;
    }

    container.innerHTML = filtered.map(req => {
        const attachmentsLink = req.has_files ? `<a href="/download-attachments/${req.id}/" class="btn-attachments" target="_blank">Скачать приложения</a>` : '';
        return `
        <div class="document-item" data-id="${req.id}">
            <div class="document-info">
                <div class="document-title">${escapeHtml(req.title)}</div>
                <div class="document-meta">
                    <span>Студент: ${escapeHtml(req.student_name)} (${escapeHtml(req.student_username)})</span><br>
                    <span>Дата: ${escapeHtml(req.date)}</span><br>
                    <span>Комментарий: ${escapeHtml(req.comment || 'нет комментария')}</span>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                <div class="document-status ${req.statusClass}">Статус: ${escapeHtml(req.status_display)}</div>
                <div style="display: flex; gap: 10px;">
                    <a href="/download-request/${req.id}/" class="btn-download" target="_blank">📄 Скачать doc</a>
                    ${attachmentsLink}
                    <select class="status-select" data-id="${req.id}" style="padding: 5px; border-radius: 4px;">
                        <option value="in_profcom" ${req.status === 'in_profcom' ? 'selected' : ''}>На рассмотрении в профкоме</option>
                        <option value="profcom_approved" ${req.status === 'profcom_approved' ? 'selected' : ''}>Одобрено профкомом</option>
                        <option value="profcom_rejected" ${req.status === 'profcom_rejected' ? 'selected' : ''}>Отклонено профкомом</option>
                    </select>
                </div>
            </div>
        </div>
    `}).join('');

    document.querySelectorAll('.document-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        if (e.target.closest('.status-select')) return;
        const id = parseInt(item.dataset.id);
        showRequestModal(id);
    });
});

    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            e.stopPropagation();
            const id = select.dataset.id;
            const newStatus = select.value;

            try {
                const response = await fetch(`/api/update-status/${id}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': window.DJANGO_DATA.csrfToken
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (response.ok) {
                    showNotification('Статус обновлён', 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    const err = await response.json();
                    showNotification(err.error || 'Ошибка обновления статуса', 'error');
                }
            } catch (error) {
                showNotification('Ошибка соединения', 'error');
            }
        });
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

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}