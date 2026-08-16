import requests
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.responses import success_response
from .serializers import QuestionCreateSerializer, QuestionListSerializer
from . import services
from .rabbitmq_client import publish_event


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
                "http://notification-service:8000/api/broadcast/question-created/",
                json={"invite_code": invite_code, "question": question_data},
                timeout=2
            )
        except requests.RequestException:
            pass  # don't let a broadcast failure break question creation

        return success_response(data=question_data, status_code=201)




class QuestionVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, question_id):
        question = services.vote_question(question_id=question_id, user_id=request.user.id)
        
        try:
            # requests.post(
            #     "http://notification-service:8000/api/broadcast/vote-updated/",
            #     json={
            #         "invite_code": question.session.invite_code,
            #         "question_id": question.id,
            #         "vote_count": question.vote_count
            #     },
            #     timeout=2
            # )
            publish_event("vote_updated", {
                "invite_code": question.session.invite_code,
                "question_id": question.id,
                "vote_count": question.vote_count
            })
            
        except requests.RequestException:
            pass
            
        return success_response(data={"vote_count": question.vote_count})
