from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from common.responses import success_response
from .serializers import SessionCreateSerializer, SessionListSerializer
from . import services

class SessionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.path.endswith('/my/'):
            sessions = services.get_my_sessions(request.user.id)
            serializer = SessionListSerializer(sessions, many=True)
            return success_response(data=serializer.data)
        return success_response(data=[])

    def post(self, request):
        serializer = SessionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session = services.create_session(title=serializer.validated_data['title'], host_id=request.user.id)
        return success_response(data=SessionListSerializer(session).data, status_code=201)

class SessionJoinValidateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, invite_code):
        session = services.get_active_session_by_code(invite_code)
        return success_response(data={
            'id': session.id,
            'title': session.title,
            'is_active': session.is_active
        })

class SessionJoinPerformView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invite_code):
        session = services.get_active_session_by_code(invite_code)
        return success_response(data={
            'id': session.id,
            'title': session.title
        }, message='Joined successfully')
