import random
import string
from django.db import models

def generate_invite_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))

class Session(models.Model):
    title = models.CharField(max_length=255)
    host = models.IntegerField()  # user_id from auth-service
    invite_code = models.CharField(max_length=10, unique=True, default=generate_invite_code)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
