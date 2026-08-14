from rest_framework import serializers
from .models import Answer
from .constants import MAX_ANSWER_LENGTH

class AnswerCreateUpdateSerializer(serializers.ModelSerializer):
    text = serializers.CharField(max_length=MAX_ANSWER_LENGTH)

    class Meta:
        model = Answer
        fields = ['text']

class AnswerRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question_id', 'text', 'created_at']
        read_only_fields = ['id', 'question_id', 'created_at']
