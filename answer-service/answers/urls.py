from django.urls import path
from .views import AnswerRetrieveUpdateView

urlpatterns = [
    path('questions/<int:question_id>/answer/', AnswerRetrieveUpdateView.as_view(), name='question-answer'),
]
