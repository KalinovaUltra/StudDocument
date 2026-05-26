// studdoc/static/studdoc/js/doc-templates.js

// Функция для получения сегодняшней даты
function getTodayDate() {
    const today = new Date();
    return today.toLocaleDateString('ru-RU');
}


function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Базовый шаблон с данными студента (для формы)
function getStudentDataSection() {
    return `
        <div class="student-data-section">
            <h4>Данные студента:</h4>
            <div class="template-field">
                <label>ФИО:</label>
                <input type="text" class="template-input student-data" id="name" name="name" placeholder="Ваше ФИО">
            </div>
            <div class="template-field">
                <label>Номер группы:</label>
                <input type="text" class="template-input student-data" id="group" name="group" placeholder="Группа">
            </div>
            <div class="template-field">
                <label>Факультет:</label>
                <input type="text" class="template-input student-data" id="faculty" name="faculty" placeholder="Факультет">
            </div>
            <div class="template-field">
                <label>Дата подачи:</label>
                <input type="text" class="template-input" id="date" name="date" value="${getTodayDate()}">
            </div>
        </div>
    `;
}

// Функция для получения HTML превью (на основе данных формы)
function getPreviewHtml(category, values) {
    const escape = (str) => escapeHtml(str || '');
    switch(category) {
        case 'material-help':
            return `
                <div class="preview-document">
                    <h3>Заявление на материальную помощь</h3>
                    <p><strong>ФИО:</strong> ${escape(values.name)}</p>
                    <p><strong>Группа:</strong> ${escape(values.group)}</p>
                    <p><strong>Факультет:</strong> ${escape(values.faculty)}</p>
                    <p><strong>Дата:</strong> ${escape(values.date)}</p>
                    <p><strong>Причина обращения:</strong> ${escape(values.reason)}</p>
                </div>
            `;
        case 'profcom':
            return `
                <div class="preview-document">
                    <h3>Заявление о вступлении в профсоюз</h3>
                    <p><strong>ФИО:</strong> ${escape(values.name)}</p>
                    <p><strong>Группа:</strong> ${escape(values.group)}</p>
                    <p><strong>Факультет:</strong> ${escape(values.faculty)}</p>
                    <p><strong>Дата:</strong> ${escape(values.date)}</p>
                    <p><strong>Текст заявления:</strong> ${escape(values.purpose)}</p>
                </div>
            `;
        case 'academic':
            return `
                <div class="preview-document">
                    <h3>Академическое заявление</h3>
                    <p><strong>ФИО:</strong> ${escape(values.name)}</p>
                    <p><strong>Группа:</strong> ${escape(values.group)}</p>
                    <p><strong>Факультет:</strong> ${escape(values.faculty)}</p>
                    <p><strong>Дата:</strong> ${escape(values.date)}</p>
                    <p><strong>Суть вопроса:</strong> ${escape(values.issue)}</p>
                </div>
            `;
        case 'social':
            return `
                <div class="preview-document">
                    <h3>Заявление на социальные льготы</h3>
                    <p><strong>ФИО:</strong> ${escape(values.name)}</p>
                    <p><strong>Группа:</strong> ${escape(values.group)}</p>
                    <p><strong>Факультет:</strong> ${escape(values.faculty)}</p>
                    <p><strong>Дата:</strong> ${escape(values.date)}</p>
                    <p><strong>Причина обращения:</strong> ${escape(values['social-reason'])}</p>
                </div>
            `;
        default:
            return '<p>Выберите категорию документа</p>';
    }
}

export const DocTemplates = {
'material-help': `
<div class="template-content">
    <h3>Заявление на материальную помощь</h3>
    <div class="student-data-section">
        <h4>Данные студента:</h4>

        <div class="template-field">
            <label>ФИО:</label>
            <input type="text" class="template-input student-data" id="name" name="name"
                   placeholder="Ваше ФИО" required>
        </div>

        <div class="template-field">
            <label>Институт / кафедра:</label>
            <input type="text" class="template-input" id="department" name="department"
                   placeholder="Название института или кафедры" required>
        </div>

        <div class="template-field">
            <label>Курс:</label>
            <input type="number" class="template-input" id="course" name="course"
                   placeholder="Например, 3" min="1" max="6" required>
        </div>

        <div class="template-field">
            <label>Группа:</label>
            <input type="text" class="template-input" id="group" name="group"
                   placeholder="Группа" required>
        </div>

        <div class="template-field">
            <label>Форма обучения:</label>
            <select class="template-input" id="education_form" name="education_form" required>
                <option value="">Выберите форму</option>
                <option value="бюджетная">Бюджетная</option>
                <option value="контрактная">Контрактная</option>
            </select>
        </div>

        <div class="template-field">
            <label>Паспорт (серия и номер):</label>
            <input type="text" class="template-input" id="passport" name="passport"
                   placeholder="10 цифр без пробелов" pattern="\\d{10}" maxlength="10"
                   title="Введите 10 цифр (серия и номер)" required>
        </div>

        <div class="template-field">
            <label>ИНН:</label>
            <input type="text" class="template-input" id="inn" name="inn"
                   placeholder="12 цифр" pattern="\\d{12}" maxlength="12"
                   title="Введите 12 цифр" required>
        </div>

        <div class="template-field">
            <label>Страховое свидетельство (СНИЛС):</label>
            <input type="text" class="template-input" id="insurance" name="insurance"
                   placeholder="16 цифр" pattern="\\d{16}" maxlength="16"
                   title="Введите 16 цифр СНИЛС (без пробелов и дефисов)" required>
        </div>

        <div class="template-field">
            <label>Прописка (адрес):</label>
            <input type="text" class="template-input" id="address" name="address"
                   placeholder="Адрес прописки" required>
        </div>

        <div class="template-field">
            <label>Дата рождения:</label>
            <input type="date" class="template-input" id="birthday" name="birthday"
                   required>
        </div>

        <div class="template-field">
            <label>Контактный телефон:</label>
            <input type="tel" class="template-input" id="telephone" name="telephone"
                   placeholder="11 цифр (89123456789)" pattern="\\d{11}" maxlength="11"
                   title="Введите 11 цифр (код оператора + номер)" required>
        </div>

        <div class="template-field">
            <label>Дата подачи:</label>
            <input type="text" class="template-input" id="date" name="date"
                   value="${getTodayDate()}" readonly>
        </div>
    </div>
    <div class="document-text-section">
        <h4>Текст заявления:</h4>
        <div class="template-field">
            <label>Причина обращения:</label>
            <textarea class="template-textarea" id="reason" name="reason"
                      placeholder="Опишите причину обращения..." required></textarea>
        </div>
    </div>
</div>
`,
    'profcom': `
        <div class="template-content">
            <h3>Заявление о вступлении в профсоюз</h3>
            ${getStudentDataSection()}
            <div class="document-text-section">
                <h4>Текст заявления:</h4>
                <div class="template-field">
                    <label>Текст заявления:</label>
                    <textarea class="template-textarea" id="purpose" name="purpose" style="height: 180px;" placeholder="Введите текст заявления...">Настоящим прошу принять меня в члены Профсоюза работников государственных учреждений и общественного обслуживания Российской Федерации.

Обязуюсь:
- соблюдать Устав Профсоюза;
- выполнять решения выборных органов Профсоюза;
- регулярно уплачивать членские взносы;
- принимать активное участие в деятельности Профсоюзной организации.

С Положением о персональных данных ознакомлен(а) и согласен(на).</textarea>
                </div>
            </div>
        </div>
    `,
    'academic': `
        <div class="template-content">
            <h3>Академическое заявление</h3>
            ${getStudentDataSection()}
            <div class="document-text-section">
                <h4>Текст заявления:</h4>
                <div class="template-field">
                    <label>Суть вопроса:</label>
                    <textarea class="template-textarea" id="issue" name="issue" placeholder="Опишите суть вопроса...">Прошу рассмотреть вопрос об академическом отпуске/пересдаче экзамена/другой академический вопрос.</textarea>
                </div>
            </div>
        </div>
    `,
    'social': `
        <div class="template-content">
            <h3>Заявление на социальные льготы</h3>
            ${getStudentDataSection()}
            <div class="document-text-section">
                <h4>Текст заявления:</h4>
                <div class="template-field">
                    <label>Причина обращения:</label>
                    <textarea class="template-textarea" id="social-reason" name="social-reason" placeholder="Опишите причину...">Прошу предоставить мне социальные льготы в соответствии с действующим законодательством.</textarea>
                </div>
            </div>
        </div>
    `
};

// Функция для заполнения шаблона данными пользователя из Django
export function fillTemplateWithUserData(templateHtml, userData) {
    if (!userData) return templateHtml;

    let filledHtml = templateHtml;

    // Функция для замены поля по id
    const replaceInput = (id, value) => {
        if (!value) return;
        const regex = new RegExp(`<input[^>]*id="${id}"[^>]*>`, 'i');
        const newInput = `<input type="text" class="template-input student-data" id="${id}" name="${id}" value="${escapeHtml(value)}" placeholder="Ваше ${id === 'name' ? 'ФИО' : (id === 'group' ? 'Группа' : 'Факультет')}">`;
        filledHtml = filledHtml.replace(regex, newInput);
    };

    replaceInput('name', userData.name);
    replaceInput('group', userData.group);
    replaceInput('faculty', userData.faculty);

    return filledHtml;
}


export { getPreviewHtml };