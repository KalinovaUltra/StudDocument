# studdoc/backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.core.exceptions import MultipleObjectsReturned

User = get_user_model()


class EmailOrUsernameBackend(ModelBackend):
    """
    функция аутентификации, позволяющий входить как по email, так и по username
    С защитой от дубликатов
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None or password is None:
            return None

        # Ищем пользователя по email или username
        try:
            user = User.objects.get(
                Q(username__iexact=username) | Q(email__iexact=username)
            )
        except User.DoesNotExist:
            return None
        except MultipleObjectsReturned:

            try:
                user = User.objects.get(username__iexact=username)
            except User.DoesNotExist:
                return None

        if user.check_password(password):
            return user
        return None