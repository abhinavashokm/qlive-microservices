from celery import shared_task
from .rabbitmq_client import publish_event

@shared_task
def publish_event_task(event_type: str, payload: dict):
    publish_event(event_type, payload)