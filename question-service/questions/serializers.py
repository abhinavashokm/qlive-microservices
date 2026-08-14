from rest_framework import serializers
from .models import Question
from .constants import MAX_QUESTION_LENGTH

class QuestionCreateSerializer(serializers.ModelSerializer):
    text = serializers.CharField(max_length=MAX_QUESTION_LENGTH)
    
    class Meta:
        model = Question
        fields = ['text']

class QuestionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'session', 'author', 'text', 'is_answered', 'created_at']
        read_only_fields = ['id', 'session', 'author', 'is_answered', 'created_at']
