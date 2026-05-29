export const StatusMap = {
  'pending': 'На рассмотрении в деканате',
  'in_profcom': 'На рассмотрении в профкоме',
  'profcom_approved': 'Одобрено профкомом',
  'profcom_rejected': 'Отклонено профкомом',
  'approved': 'Одобрено деканатом',
  'rejected': 'Отклонено деканатом'
};

export const StatusClassMap = {
  'pending': 'status-pending',
  'На рассмотрении в деканате': 'status-pending',
  'in_profcom': 'status-in-profcom',
  'На рассмотрении в профкоме': 'status-in-profcom',
  'profcom_approved': 'status-profcom-approved',
  'Одобрено профкомом': 'status-profcom-approved',
  'profcom_rejected': 'status-profcom-rejected',
  'Отклонено профкомом': 'status-profcom-rejected',
  'approved': 'status-approved',
  'Одобрено деканатом': 'status-approved',
  'rejected': 'status-rejected',
  'Отклонено деканатом': 'status-rejected'
};

export const Categories = [
  { value: 'material-help', text: 'Материальная помощь' },
  { value: 'profcom', text: 'Заявление о вступлении в Профком' },
  { value: 'academic', text: 'Академический отпуск' },
  { value: 'social', text: 'Социальные льготы (ПГАС)' },
  { value: 'dismissal', text: 'Отчисление по собственному желанию' },
  { value: 'personal_data', text: 'Согласие на обработку персональных данных' },
];