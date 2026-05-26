// studdoc/static/studdoc/js/components/notification-component.js

export default class NotificationComponent {
    constructor(containerId = 'notification') {
        this.container = document.getElementById(containerId);
        this.timeout = null;
    }

    show(message, type = 'info') {
        if (!this.container) return;

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.container.textContent = message;
        this.container.className = `notification show ${type}`;

        this.timeout = setTimeout(() => {
            this.hide();
        }, 3000);
    }

    showSuccess(message) {
        this.show(message, 'success');
    }

    showError(message) {
        this.show(message, 'error');
    }

    hide() {
        if (this.container) {
            this.container.classList.remove('show');
        }
    }
}