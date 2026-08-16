import requests
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.responses import success_response
from .serializers import QuestionCreateSerializer, QuestionListSerializer
from . import services

class QuestionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, invite_code):
        questions = services.list_questions(invite_code)
        serializer = QuestionListSerializer(questions, many=True)
        return success_response(data=serializer.data)

    def post(self, request, invite_code):
        serializer = QuestionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = services.create_question(
            invite_code=invite_code,
            text=serializer.validated_data['text'],
            author_id=request.user.id
        )
        question_data = QuestionListSerializer(question).data

        try:
            requests.post(
                "http://localhost:8003/api/broadcast/question-created/",
                json={"invite_code": invite_code, "question": question_data},
                timeout=2
            )
        except requests.RequestException:
            pass  # don't let a broadcast failure break question creation

        return success_response(data=question_data, status_code=201)
class QuestionMarkAnsweredView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, invite_code, pk):
        services.mark_question_answered(invite_code, pk, request.user.id)
        return success_response(message='marked as answered')
