import json
from channels.generic.websocket import AsyncWebsocketConsumer

class SessionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.invite_code = self.scope["url_route"]["kwargs"]["invite_code"]
        self.group_name = f"session_{self.invite_code}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # This method name must match the "type" key sent in group_send (step 6)
    async def question_created(self, event):
        await self.send(text_data=json.dumps({
            "type": "question_created",
            "question": event["question"]
        }))