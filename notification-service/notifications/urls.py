from django.urls import path
from .views import BroadcastQuestionCreated, BroadcastVoteUpdated

urlpatterns = [
    path("broadcast/question-created/", BroadcastQuestionCreated.as_view()),

    path("broadcast/vote-updated/", BroadcastVoteUpdated.as_view()),
]