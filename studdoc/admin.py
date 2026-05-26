from django.contrib import admin
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import UserProfile, DocumentTemplate, Request, RequestFile


class UserProfileForm(forms.ModelForm):
    # Поля для создания/редактирования пользователя
    username = forms.CharField(max_length=150, required=True, label="Логин")
    password = forms.CharField(widget=forms.PasswordInput, required=False, label="Пароль")
    confirm_password = forms.CharField(widget=forms.PasswordInput, required=False, label="Подтверждение пароля")
    email = forms.EmailField(required=False, label="Email (можно заполнить позже)")

    # Поля для ФИО
    last_name = forms.CharField(max_length=150, required=False, label="Фамилия")
    first_name = forms.CharField(max_length=150, required=False, label="Имя")
    patronymic = forms.CharField(max_length=100, required=False, label="Отчество")

    class Meta:
        model = UserProfile
        fields = ('role', 'group', 'faculty')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._user_created = False  # Флаг, чтобы не создавать пользователя дважды

        if self.instance and self.instance.user_id:
            user = self.instance.user
            self.fields['username'].initial = user.username
            self.fields['email'].initial = user.email
            self.fields['last_name'].initial = self.instance.last_name
            self.fields['first_name'].initial = self.instance.first_name
            self.fields['patronymic'].initial = self.instance.patronymic
            self.fields['password'].required = False
            self.fields['confirm_password'].required = False
        else:
            self.fields['username'].required = True
            self.fields['password'].required = True
            self.fields['confirm_password'].required = True
            self.fields['email'].required = False

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not username:
            raise forms.ValidationError("Логин обязателен")

        username = username.lower().strip()

        # Проверяем уникальность ТОЛЬКО для существующих пользователей
        user_id = self.instance.user_id if self.instance.pk else None
        if user_id:  # Только при редактировании существующего
            if User.objects.exclude(id=user_id).filter(username=username).exists():
                raise forms.ValidationError(f"Пользователь с логином '{username}' уже существует")

        return username

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm = cleaned_data.get('confirm_password')

        if self.instance.pk is None:  # Новый профиль
            if not password:
                raise forms.ValidationError("Пароль обязателен")
            if password != confirm:
                raise forms.ValidationError("Пароли не совпадают")
            if len(password) < 5:
                raise forms.ValidationError("Пароль должен содержать не менее 5 символов")
        else:
            if password and password != confirm:
                raise forms.ValidationError("Пароли не совпадают")
            if password and len(password) < 5:
                raise forms.ValidationError("Пароль должен содержать не менее 5 символов")
        return cleaned_data

    def save(self, commit=True):
        # Если пользователь уже создан в этом экземпляре формы, пропускаем
        if self._user_created:
            print("=== Пропускаем повторное сохранение ===")
            if commit:
                self.instance.save()
            return self.instance

        username = self.cleaned_data.get('username')
        if username:
            username = username.lower().strip()

        password = self.cleaned_data.get('password')
        email = self.cleaned_data.get('email', '')

        print(f"=== СОЗДАЁМ пользователя с username: '{username}' ===")

        if self.instance.pk and self.instance.user_id:
            # Обновление существующего профиля
            user = self.instance.user
            user.username = username
            user.email = email
            if password:
                user.set_password(password)
            user.save()
        else:
            # Создание нового пользователя
            # Проверяем, существует ли уже пользователь с таким username
            existing_user = User.objects.filter(username=username).first()
            if existing_user:
                # Если уже существует связываем с ним
                print(f"Пользователь '{username}' уже существует, привязываем к нему профиль")
                self.instance.user = existing_user
            else:
                # Создаём нового пользователя
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password
                )
                self.instance.user = user
                print(f"Создан новый пользователь: '{username}'")

        # Сохраняем ФИО в профиле
        self.instance.last_name = self.cleaned_data.get('last_name', '')
        self.instance.first_name = self.cleaned_data.get('first_name', '')
        self.instance.patronymic = self.cleaned_data.get('patronymic', '')

        if commit:
            self.instance.save()

        self._user_created = True  # Устанавливаем флаг
        return self.instance

    def save_m2m(self):
        pass


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    form = UserProfileForm
    list_display = ('get_full_name', 'get_username', 'get_email', 'role', 'group', 'faculty')
    list_filter = ('role',)
    search_fields = ('last_name', 'first_name', 'patronymic', 'user__username', 'user__email')

    fieldsets = (
        ('Учётная запись', {
            'fields': ('username', 'password', 'confirm_password', 'email')
        }),
        ('Личные данные', {
            'fields': ('last_name', 'first_name', 'patronymic')
        }),
        ('Учебная информация', {
            'fields': ('group', 'faculty')
        }),
        ('Роль', {
            'fields': ('role',)
        }),
    )

    def get_full_name(self, obj):
        return obj.get_full_name()

    get_full_name.short_description = "ФИО"

    def get_username(self, obj):
        return obj.user.username if obj.user else ''

    get_username.short_description = "Логин"

    def get_email(self, obj):
        return obj.user.email if obj.user else ''

    get_email.short_description = "Email"

    def save_model(self, request, obj, form, change):
        form.save()


@admin.register(DocumentTemplate)
class DocumentTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'created_at')
    list_filter = ('category',)


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'category', 'status', 'created_at')
    list_filter = ('status', 'category')


@admin.register(RequestFile)
class RequestFileAdmin(admin.ModelAdmin):
    list_display = ('request', 'uploaded_at')