# decorators.py
from django.shortcuts import redirect
from django.contrib import messages


def role_required(allowed_roles):
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect('login')

            try:
                user_role = request.user.profile.role
            except:
                return redirect('login')

            if user_role not in allowed_roles:
                messages.error(request, 'У вас нет прав для доступа к этой странице.')
                return redirect('home')
            return view_func(request, *args, **kwargs)

        return wrapper

    return decorator