// studdoc/static/studdoc/js/components/form-container-component.js

export default class FormContainerComponent {
    constructor(formSelector, onSubmitCallback = null) {
        this.form = document.querySelector(formSelector);
        this.categorySelect = this.form?.querySelector('#category');
        this.templateArea = this.form?.querySelector('#templateArea');
        this.onSubmitCallback = onSubmitCallback;

        if (this.form) {
            this.init();
        }
    }

    init() {
        // Обработчик изменения категории
        this.categorySelect?.addEventListener('change', (e) => {
            this.loadTemplate(e.target.value);
        });

        // Обработчик отправки формы
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!this.validateForm()) {
                return;
            }

            if (this.onSubmitCallback) {
                const formData = new FormData(this.form);
                this.onSubmitCallback(formData);
            }
        });
    }

    async loadTemplate(category) {
        if (!category) {
            this.templateArea.innerHTML = '<div class="template-placeholder"><p>Выберите категорию документа</p></div>';
            return;
        }

        try {
            const response = await fetch(`/api/get-template/${category}/`);
            if (response.ok) {
                const html = await response.text();
                this.templateArea.innerHTML = html;
            } else {
                this.templateArea.innerHTML = '<div class="template-placeholder"><p>Шаблон не найден</p></div>';
            }
        } catch (error) {
            console.error('Ошибка загрузки шаблона:', error);
            this.templateArea.innerHTML = '<div class="template-placeholder"><p>Ошибка загрузки шаблона</p></div>';
        }
    }

    validateForm() {
        const category = this.categorySelect?.value;
        if (!category) {
            this.showError('Выберите категорию документа');
            return false;
        }

        const templateInputs = this.templateArea?.querySelectorAll('input, textarea, select');
        if (templateInputs) {
            for (const input of templateInputs) {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    this.showError(`Заполните поле: ${input.labels?.[0]?.textContent || input.placeholder || 'поле формы'}`);
                    input.focus();
                    return false;
                }
            }
        }

        return true;
    }

    showError(message) {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show', 'error');
            setTimeout(() => {
                notification.classList.remove('show', 'error');
            }, 3000);
        } else {
            alert(message);
        }
    }

    resetForm() {
        if (this.form) {
            this.form.reset();
            this.categorySelect.selectedIndex = 0;
            this.loadTemplate('');
        }
    }

    destroy() {
        // Очистка обработчиков
        this.categorySelect?.removeEventListener('change', this.loadTemplate);
    }
}