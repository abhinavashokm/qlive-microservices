import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework import exceptions

class DummyUser:
    def __init__(self, user_id):
        self.id = user_id
        self.is_authenticated = True

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
        except ValueError:
            return None

        try:
            payload = jwt.decode(
                token, 
                settings.AUTH_SERVICE_SECRET_KEY, 
                algorithms=["HS256"]
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')

        user_id = payload.get('user_id')
        if not user_id:
            raise exceptions.AuthenticationFailed('Token contains no user_id')

        return (DummyUser(user_id), None)
