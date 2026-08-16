from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework.views import APIView
from rest_framework.response import Response

class BroadcastQuestionCreated(APIView):
    def post(self, request):
        invite_code = request.data["invite_code"]
        question = request.data["question"]

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"session_{invite_code}",
            {"type": "question_created", "question": question}  # "type" must match consumer method name
        )
        return Response({"status": "broadcasted"})