from django.urls import path
from .views import SessionListCreateView, SessionJoinValidateView, SessionJoinPerformView

urlpatterns = [
    path('', SessionListCreateView.as_view(), name='session-create'),
    path('my/', SessionListCreateView.as_view(), name='session-list-my'),
    path('join/<str:invite_code>/', SessionJoinValidateView.as_view(), name='session-join-validate'),
    path('<str:invite_code>/join/', SessionJoinPerformView.as_view(), name='session-join-perform'),
]
