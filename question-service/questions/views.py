import logging
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.responses import success_response
from .serializers import QuestionCreateSerializer, QuestionListSerializer
from . import services
from .tasks import publish_event_task

logger = logging.getLogger(__name__)


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
        question_data = dict(QuestionListSerializer(question).data)

        try:
            publish_event_task.delay("question_created", {
                "invite_code": invite_code,
                "question": question_data,
            })
        except Exception:
            logger.exception("Failed to enqueue question_created event")

        return success_response(data=question_data, status_code=201)




class QuestionVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, question_id):
        question = services.vote_question(question_id=question_id, user_id=request.user.id)
        
        try:
            publish_event_task.delay("vote_updated", {
                "invite_code": question.session.invite_code,
                "question_id": question.id,
                "vote_count": question.vote_count
            })
            
        except Exception:
            logger.exception("Failed to enqueue vote_updated event")
            
        return success_response(data={"vote_count": question.vote_count})

class QuestionSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, invite_code):
        query_text = request.query_params.get('q', '')
        questions = services.search_questions(invite_code=invite_code, query_text=query_text)
        serializer = QuestionListSerializer(questions, many=True)
        return success_response(data=serializer.data)
