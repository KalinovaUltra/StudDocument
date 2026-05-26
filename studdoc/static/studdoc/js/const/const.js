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
  { value: 'profcom', text: 'Профком' },
  { value: 'academic', text: 'Академические вопросы' },
  { value: 'social', text: 'Социальные льготы' }
];