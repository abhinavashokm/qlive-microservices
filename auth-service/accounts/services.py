from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from common.exceptions import AppError

def create_user(username: str, password: str, full_name: str = '') -> tuple[User, str, str]:
    """Creates a new user and generates JWT tokens for immediate login."""
    if User.objects.filter(username=username).exists():
        raise AppError("Username already taken.")
        
    user = User.objects.create_user(username=username, password=password, full_name=full_name)
    refresh = RefreshToken.for_user(user)
    
    return user, str(refresh.access_token), str(refresh)
