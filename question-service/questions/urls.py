from django.urls import path
from .views import QuestionVoteView

urlpatterns = [
    path('<int:question_id>/vote/', QuestionVoteView.as_view(), name='question-vote'),
]
