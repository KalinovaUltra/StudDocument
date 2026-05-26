// studdoc/static/studdoc/js/dynamic-form.js

import { DocTemplates, fillTemplateWithUserData, getPreviewHtml } from './doc-templates/doc-templates.js';
import { Categories } from './const/const.js';

export function initDynamicForm() {
    const categorySelect = document.getElementById('category');
    const templateFields = document.getElementById('templateFields');
    const previewContainerOuter = document.getElementById('previewContainer'); // внешний контейнер (с заголовком)
    const previewInner = document.getElementById('live-preview'); // внутренний блок для содержимого

    if (!categorySelect || !templateFields) return;

    // Скрываем весь блок превью до выбора категории
    if (previewContainerOuter) previewContainerOuter.style.display = 'none';

    // Заполняем select категориями
    Categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.value;
        option.textContent = cat.text;
        categorySelect.appendChild(option);
    });

    let currentCategory = '';

    // Обработчик изменения категории
    categorySelect.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        if (!currentCategory) {
            templateFields.innerHTML = '';
            if (previewContainerOuter) previewContainerOuter.style.display = 'none';
            if (previewInner) previewInner.innerHTML = '<p>Выберите категорию документа</p>';
            return;
        }

        let templateHtml = DocTemplates[currentCategory];
        if (!templateHtml) {
            templateFields.innerHTML = '<p class="error">Шаблон не найден</p>';
            if (previewInner) previewInner.innerHTML = '<p class="error">Ошибка загрузки шаблона</p>';
            if (previewContainerOuter) previewContainerOuter.style.display = 'block';
            return;
        }

        if (window.DJANGO_DATA && window.DJANGO_DATA.userData) {
            templateHtml = fillTemplateWithUserData(templateHtml, window.DJANGO_DATA.userData);
        }

        templateFields.innerHTML = templateHtml;

        // Показываем контейнер превью
        if (previewContainerOuter) previewContainerOuter.style.display = 'block';

        // Навешиваем обработчики на поля для обновления превью
        attachPreviewHandlers(currentCategory);
        updatePreview(currentCategory);
    });
}

function attachPreviewHandlers(category) {
    const form = document.getElementById('requestForm');
    if (!form) return;
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.removeEventListener('input', () => updatePreview(category));
        input.addEventListener('input', () => updatePreview(category));
    });
}

async function updatePreview(category) {
    const previewInner = document.getElementById('live-preview');
    if (!previewInner) return;
    if (!category) {
        previewInner.innerHTML = '<p>Выберите категорию документа</p>';
        return;
    }

    const form = document.getElementById('requestForm');
    if (!form) return;
    const formData = new FormData(form);
    const values = {};
    for (let [key, value] of formData.entries()) {
        values[key] = value;
    }
    if (!values.date) {
        const dateInput = document.getElementById('date');
        if (dateInput) values.date = dateInput.value;
    }

    try {
        const response = await fetch(`/api/preview/${category}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.DJANGO_DATA.csrfToken
            },
            body: JSON.stringify({ values: values })
        });
        const data = await response.json();
        if (data.success) {
            previewInner.innerHTML = data.html;
        } else {
            previewInner.innerHTML = '<p class="error">Ошибка загрузки превью</p>';
        }
    } catch (err) {
        console.error(err);
        previewInner.innerHTML = '<p class="error">Ошибка соединения</p>';
    }
}