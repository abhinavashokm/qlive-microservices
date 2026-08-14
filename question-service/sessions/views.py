from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Session
from .serializers import SessionSerializer

class SessionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.path.endswith('/my/'):
            sessions = Session.objects.filter(host=request.user.id)
            serializer = SessionSerializer(sessions, many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        serializer = SessionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(host=request.user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SessionJoinValidateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, invite_code):
        session = get_object_or_404(Session, invite_code=invite_code, is_active=True)
        return Response({
            'id': session.id,
            'title': session.title,
            'is_active': session.is_active
        })

class SessionJoinPerformView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invite_code):
        session = get_object_or_404(Session, invite_code=invite_code, is_active=True)
        return Response({
            'id': session.id,
            'title': session.title,
            'message': 'Joined successfully'
        })
