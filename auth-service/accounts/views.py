from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from common.responses import success_response
from .serializers import UserSerializer, UserDetailSerializer
from . import services

class SignupView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user, access, refresh = services.create_user(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password'],
            full_name=serializer.validated_data.get('full_name', '')
        )
        
        return success_response(data={'access': access, 'refresh': refresh}, status_code=201)

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return success_response(data=serializer.data)
