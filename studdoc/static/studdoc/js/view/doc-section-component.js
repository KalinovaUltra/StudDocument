// studdoc/static/studdoc/js/components/doc-section-component.js

export default class DocSectionComponent {
    constructor(containerSelector, onDocumentClick = null) {
        this.container = document.querySelector(containerSelector);
        this.documentsList = this.container?.querySelector('.documents-list');
        this.onDocumentClick = onDocumentClick;
        this.documents = [];
    }

    // Обновить список документов
    updateDocuments(documents) {
        this.documents = documents;
        this.render();
    }

    // Рендер списка (переиспользуем существующий HTML или обновляем)
    render() {
        if (!this.documentsList) return;

        if (this.documents.length === 0) {
            this.documentsList.innerHTML = `
                <div class="empty-state">
                    <p>У вас пока нет отправленных заявок</p>
                </div>
            `;
        } else {
            // Данные уже отрендерены Django, просто обновляем статусы и подписываем события
            this.attachClickHandlers();
        }
    }

    // Навесить обработчики на существующие элементы
    attachClickHandlers() {
        const items = this.documentsList.querySelectorAll('.document-item');
        items.forEach(item => {
            item.removeEventListener('click', this.handleItemClick);
            item.addEventListener('click', this.handleItemClick.bind(this));
        });
    }

    handleItemClick(event) {
        const item = event.currentTarget;
        const documentId = item.dataset.id;
        const document = this.documents.find(doc => doc.id == documentId);

        if (document && this.onDocumentClick) {
            this.onDocumentClick(document);
        }
    }

    destroy() {
        if (this.documentsList) {
            const items = this.documentsList.querySelectorAll('.document-item');
            items.forEach(item => {
                item.removeEventListener('click', this.handleItemClick);
            });
        }
    }
}