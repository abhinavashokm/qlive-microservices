import pika
import json
import os
import threading

_thread_local = threading.local()

def get_channel():
    if not hasattr(_thread_local, "connection") or _thread_local.connection.is_closed:
        _thread_local.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=os.environ.get("RABBITMQ_HOST", "rabbitmq"))
        )
        _thread_local.channel = _thread_local.connection.channel()
        _thread_local.channel.queue_declare(queue="notifications")
    return _thread_local.channel

def publish_event(event_type: str, payload: dict):
    try:
        channel = get_channel()
        message = json.dumps({"event_type": event_type, "payload": payload})
        channel.basic_publish(exchange="", routing_key="notifications", body=message)
    except Exception:
        if hasattr(_thread_local, "connection") and not _thread_local.connection.is_closed:
            try:
                _thread_local.connection.close()
            except Exception:
                pass
        
        channel = get_channel()
        message = json.dumps({"event_type": event_type, "payload": payload})
        channel.basic_publish(exchange="", routing_key="notifications", body=message)