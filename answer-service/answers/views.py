from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.responses import success_response
from .serializers import AnswerCreateUpdateSerializer, AnswerRetrieveSerializer
from . import services

class AnswerRetrieveUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, question_id):
        # TODO: vote counting + Redis caching — implemented separately by hand
        answer = services.get_answer_for_question(question_id)
        serializer = AnswerRetrieveSerializer(answer)
        return success_response(data=serializer.data)

    def post(self, request, question_id):
        serializer = AnswerCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        answer, created = services.submit_answer(
            question_id=question_id, 
            text=serializer.validated_data['text'],
            host_id=request.user.id
        )
        
        status_code = 201 if created else 200
        return success_response(data=AnswerRetrieveSerializer(answer).data, status_code=status_code)
