# forms.py
from django import forms
from .models import Request

class RequestForm(forms.ModelForm):
    class Meta:
        model = Request
        fields = ['category', 'comment']
        widgets = {
            'category': forms.Select(attrs={'class': 'form-select', 'id': 'category', 'required': 'required'}),
            'comment': forms.Textarea(attrs={'class': 'form-textarea', 'id': 'reason', 'placeholder': 'Опишите причину обращения'}),
        }