// studdoc/static/studdoc/js/components/document-modal-component.js

export default class DocumentModalComponent {
    constructor() {
        this.modal = null;
        this.onCloseCallback = null;
        this.createModal();
    }

    createModal() {
        // Проверяем, нет ли уже модального окна
        if (document.getElementById('documentModal')) {
            this.modal = document.getElementById('documentModal');
        } else {
            this.modal = document.createElement('div');
            this.modal.id = 'documentModal';
            this.modal.className = 'modal-overlay';
            this.modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div id="modalBody"></div>
                </div>
            `;
            document.body.appendChild(this.modal);
        }
        this.initEventListeners();
    }

    initEventListeners() {
        const closeBtn = this.modal.querySelector('.close-modal');

        closeBtn?.addEventListener('click', () => this.hide());
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) this.hide();
        });
    }

    show(documentData) {
        const modalBody = this.modal.querySelector('#modalBody');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <h3>${this.escapeHtml(documentData.title || 'Без названия')}</h3>
            <div class="modal-document-info">
                <p><strong>Категория:</strong> ${this.escapeHtml(documentData.category)}</p>
                <p><strong>Статус:</strong> <span class="status-${documentData.status}">${this.escapeHtml(documentData.status)}</span></p>
                <p><strong>Дата отправки:</strong> ${this.escapeHtml(documentData.date || 'Не указана')}</p>
                <p><strong>Комментарий:</strong> ${this.escapeHtml(documentData.comment || 'нет комментария')}</p>
            </div>
            <div class="modal-document-text">
                <h4>Текст заявления:</h4>
                <div class="text-content">${this.escapeHtml(documentData.text || 'Текст отсутствует')}</div>
            </div>
            ${documentData.files && documentData.files.length ? `
                <div class="modal-files">
                    <h4>Прикрепленные файлы:</h4>
                    <ul>
                        ${documentData.files.map(f => `<li><a href="${this.escapeHtml(f)}" target="_blank">Скачать</a></li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <div style="margin-top: 20px; text-align: right;">
                <button class="btn btn-submit" id="downloadRequestBtn">Скачать заявку</button>
            </div>
        `;

        const downloadBtn = this.modal.querySelector('#downloadRequestBtn');
        if (downloadBtn && documentData.id) {
            downloadBtn.addEventListener('click', () => {
                window.open(`/download-request/${documentData.id}/`, '_blank');
            });
        }

        this.modal.style.display = 'flex';
    }

    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }

    setOnClose(callback) {
        this.onCloseCallback = callback;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
}