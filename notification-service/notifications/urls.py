from django.urls import path
from .views import BroadcastQuestionCreated

urlpatterns = [path("broadcast/question-created/", BroadcastQuestionCreated.as_view())]