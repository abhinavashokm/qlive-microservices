import sys
import os
import django

sys.path.append(os.path.abspath('auth-service'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from common.responses import success_response
from accounts.serializers import UserDetailSerializer
from accounts.models import User

user = User(username='test', full_name='Test')
serializer = UserDetailSerializer(user)
resp = success_response(data=serializer.data)
print("SUCCESS RESPONSE:", resp.data)
