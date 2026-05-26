// studdoc/static/studdoc/js/components/info-component.js

export default class InfoComponent {
    constructor(containerSelector, onSaveCallback = null) {
        this.container = document.querySelector(containerSelector);
        this.onSaveCallback = onSaveCallback;
        this.isEditing = false;

        if (this.container) {
            this.init();
        }
    }

    init() {
        const editBtn = this.container.querySelector('#editProfileBtn');
        const saveBtn = this.container.querySelector('#saveProfileBtn');
        const cancelBtn = this.container.querySelector('#cancelEditBtn');

        editBtn?.addEventListener('click', () => this.enableEditing());
        saveBtn?.addEventListener('click', () => this.saveChanges());
        cancelBtn?.addEventListener('click', () => this.disableEditing());
    }

    enableEditing() {
        const viewMode = this.container.querySelector('.user-details');
        const editMode = this.container.querySelector('#editForm');

        if (viewMode && editMode) {
            viewMode.style.display = 'none';
            editMode.style.display = 'block';
            this.isEditing = true;
        }
    }

    disableEditing() {
        const viewMode = this.container.querySelector('.user-details');
        const editMode = this.container.querySelector('#editForm');

        if (viewMode && editMode) {
            viewMode.style.display = 'block';
            editMode.style.display = 'none';
            this.isEditing = false;
        }
    }

    async saveChanges() {
        const name = this.container.querySelector('#edit-name')?.value || '';
        const group = this.container.querySelector('#edit-group')?.value || '';
        const faculty = this.container.querySelector('#edit-faculty')?.value || '';

        if (this.onSaveCallback) {
            await this.onSaveCallback({ name, group, faculty });
        }
    }

    updateDisplay(data) {
        // Обновляем отображаемые данные
        const nameElem = this.container.querySelector('.user-details h3');
        const groupElem = this.container.querySelector('.user-details p');

        if (nameElem) nameElem.textContent = data.name;
        if (groupElem) groupElem.textContent = `${data.group}, ${data.faculty}`;

        // Обновляем поля формы
        const editName = this.container.querySelector('#edit-name');
        const editGroup = this.container.querySelector('#edit-group');
        const editFaculty = this.container.querySelector('#edit-faculty');

        if (editName) editName.value = data.name;
        if (editGroup) editGroup.value = data.group;
        if (editFaculty) editFaculty.value = data.faculty;

        this.disableEditing();
    }

    destroy() {
        // Очистка обработчиков
        const editBtn = this.container.querySelector('#editProfileBtn');
        const saveBtn = this.container.querySelector('#saveProfileBtn');
        const cancelBtn = this.container.querySelector('#cancelEditBtn');

        editBtn?.removeEventListener('click', this.enableEditing);
        saveBtn?.removeEventListener('click', this.saveChanges);
        cancelBtn?.removeEventListener('click', this.disableEditing);
    }
}