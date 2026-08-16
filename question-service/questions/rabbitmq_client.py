import pika
import json
import os

def publish_event(event_type: str, payload: dict):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=os.environ.get("RABBITMQ_HOST", "localhost"))
    )
    channel = connection.channel()
    channel.queue_declare(queue="notifications")  # creates the queue if it doesn't exist

    message = json.dumps({"event_type": event_type, "payload": payload})
    channel.basic_publish(exchange="", routing_key="notifications", body=message)

    connection.close()