from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from studdoc import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    # Страницы
    path('', views.index, name='index'),
    path('profile/', views.profile, name='profile'),
    path('login/', auth_views.LoginView.as_view(template_name='studdoc/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='index'), name='logout'),
    path('deanery/', views.deanery_panel, name='deanery_panel'),
    path('profcom/', views.profcom_panel, name='profcom_panel'),

    # API для AJAX
    path('profile/update/', views.update_profile, name='update_profile'),
    path('api/create-request/', views.create_request_api, name='create_request_api'),
    path('api/request/<int:request_id>/', views.request_detail, name='request_detail'),
    path('api/deanery/request/<int:request_id>/', views.deanery_request_detail, name='deanery_request_detail'),
    path('api/update-status/<int:request_id>/', views.update_request_status, name='update_request_status'),
    path('api/request-preview/<int:request_id>/', views.request_preview_html, name='request_preview_html'),
    path('api/preview/<str:category>/', views.preview_template_api, name='preview_template_api'),
    path('download-request/<int:request_id>/', views.download_request_docx, name='download_request_docx'),
    path('download-attachments/<int:request_id>/', views.download_attachments, name='download_attachments'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
