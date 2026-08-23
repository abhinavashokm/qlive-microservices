import pika
import json
import os
import time
from django.core.management.base import BaseCommand
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class Command(BaseCommand):
    help = "Listens to RabbitMQ and broadcasts events over WebSocket"

    def handle(self, *args, **options):
        while True:
            try:
                connection = pika.BlockingConnection(
                    pika.ConnectionParameters(host=os.environ.get("RABBITMQ_HOST", "rabbitmq"))
                )
                channel = connection.channel()
                channel.queue_declare(queue="notifications")

                def callback(ch, method, properties, body):
                    message = json.loads(body)
                    event_type = message["event_type"]
                    payload = message["payload"]

                    channel_layer = get_channel_layer()
                    async_to_sync(channel_layer.group_send)(
                        f"session_{payload['invite_code']}",
                        {"type": event_type, **payload}
                    )
                    self.stdout.write(f"Broadcasted: {event_type} → {payload}")

                channel.basic_consume(queue="notifications", on_message_callback=callback, auto_ack=True)
                self.stdout.write("Listening for RabbitMQ events...")
                channel.start_consuming()
            except pika.exceptions.AMQPConnectionError:
                self.stdout.write("Connection lost to RabbitMQ. Retrying in 5 seconds...")
                time.sleep(5)
            except Exception as e:
                self.stdout.write(f"Unexpected error: {e}")
                time.sleep(5)