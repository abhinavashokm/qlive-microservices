from rest_framework import serializers
from .models import Session

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'title', 'host', 'invite_code', 'is_active', 'created_at']
        read_only_fields = ['id', 'host', 'invite_code', 'is_active', 'created_at']
