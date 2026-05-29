# models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator

class UserProfile(models.Model): #РОЛИ
    ROLE_CHOICES = [
        ('student', 'Студент'),
        ('staff', 'Сотрудник деканата'),
        ('profcom', 'Сотрудник профкома'),
        ('admin', 'Администратор'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    group = models.CharField(max_length=50, blank=True, null=True)
    faculty = models.CharField(max_length=100, blank=True, null=True)

    # ФИО хранятся здесь, а не в User
    last_name = models.CharField(max_length=150, blank=True, verbose_name="Фамилия")
    first_name = models.CharField(max_length=150, blank=True, verbose_name="Имя")
    patronymic = models.CharField(max_length=150, blank=True, verbose_name="Отчество")

    def get_full_name(self):
        """Возвращает ФИО в формате 'Фамилия Имя Отчество'"""
        parts = [self.last_name, self.first_name, self.patronymic]
        return ' '.join(p for p in parts if p) or self.user.username

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

class DocumentTemplate(models.Model): #КАТЕГОРИИ ДОКУМЕНТОВ ДЛЯ ШАБЛОНОВ
    CATEGORY_CHOICES = [
        ('material-help', 'Материальная помощь'),
        ('profcom', 'Заявление о вступлении в Профком'),
        ('academic', 'Академический отпуск'),
        ('social', 'Социальные льготы (ПГАС)'),
        ('dismissal', 'Отчисление по собственному желанию'),
        ('personal_data', 'Согласие на обработку персональных данных'),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    file = models.FileField(upload_to='templates/', validators=[FileExtensionValidator(['docx'])])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class Request(models.Model):
    CATEGORY_CHOICES = [
        ('material-help', 'Материальная помощь'),
        ('profcom', 'Заявление о вступлении в Профком'),
        ('academic', 'Академический отпуск'),
        ('social', 'Социальные льготы (ПГАС)'),
        ('dismissal', 'Отчисление по собственному желанию'),
        ('personal_data', 'Согласие на обработку персональных данных'),
    ]

    STATUS_CHOICES = [
        ('pending', 'На рассмотрении в деканате'),
        ('in_profcom', 'На рассмотрении в профкоме'),
        ('profcom_approved', 'Одобрено профкомом'),
        ('profcom_rejected', 'Отклонено профкомом'),
        ('approved', 'Одобрено деканатом'),
        ('rejected', 'Отклонено деканатом'),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    comment = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    template = models.ForeignKey(DocumentTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    form_data = models.JSONField(default=dict, blank=True)  # для хранения заполненных полей

    def __str__(self):
        return f"Заявка от {self.student.username} - {self.get_category_display()}"

class RequestFile(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name='attached_files')
    file = models.FileField(upload_to='request_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
