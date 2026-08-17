import json
from .models import Question, Vote
from sessions.services import get_active_session_by_code
from common.exceptions import ForbiddenError, NotFoundError
from .redis_client import redis_client
from django.db import IntegrityError
from .elasticsearch_client import es_client, QUESTIONS_INDEX



def list_questions(invite_code: str):
    cache_key = f"session:{invite_code}:questions"
    cached = redis_client.get(cache_key)

    if cached is not None:
        return json.loads(cached)  # served entirely from Redis, no DB hit

    # Cache miss — build it from Postgres
    session = get_active_session_by_code(invite_code)
    questions = list(Question.objects.filter(session=session).order_by('created_at'))

    data = [
        {"id": q.id, "text": q.text, "vote_count": q.vote_count, "is_answered": q.is_answered}
        for q in questions
    ]
    data.sort(key=lambda q: q["vote_count"], reverse=True)

    redis_client.set(cache_key, json.dumps(data), ex=60)  # cache for 60 seconds
    return data


def create_question(invite_code: str, text: str, author_id: int) -> Question:
    """Creates a new question within an active session."""
    session = get_active_session_by_code(invite_code)
    question = Question.objects.create(session=session, text=text, author=author_id)

    # Add to Elasticsearch
    es_client.index(
        index=QUESTIONS_INDEX,
        id=question.id,
        document={
            "id": question.id,
            "text": question.text,
            "session_invite_code": invite_code,
        }
    )

    # Invalidate cache so next list_questions hits the DB
    cache_key = f"session:{invite_code}:questions"
    redis_client.delete(cache_key)

    return question


def mark_question_answered(invite_code: str, question_id: int, requester_id: int):
    """Marks a question as answered, verifying the requester is the session host."""
    session = get_active_session_by_code(invite_code)
    if session.host != requester_id:
        raise ForbiddenError('Only the host can mark questions as answered.')
    
    try:
        question = Question.objects.get(pk=question_id, session=session)
    except Question.DoesNotExist:
        raise NotFoundError('Question not found.')
        
    question.is_answered = True
    question.save()
    return question


def vote_question(question_id: int, user_id: int) -> Question:
    """Upvotes a question and returns the updated question instance."""
    try:
        question = Question.objects.select_related('session').get(id=question_id)
    except Question.DoesNotExist:
        raise NotFoundError('Question not found.')
        
    try:
        Vote.objects.create(question=question, user_id=user_id)
    except IntegrityError:
        from rest_framework.exceptions import APIException
        class ConflictError(APIException):
            status_code = 409
            default_detail = 'Already voted'
        raise ConflictError()
        
    question.vote_count += 1
    question.save(update_fields=['vote_count'])
    
    redis_client.set(f"question:{question.id}:votes", question.vote_count)
    return question

def search_questions(invite_code: str, query_text: str):
    """Searches questions in a session using Elasticsearch full-text matching."""
    if not query_text:
        return list_questions(invite_code)  # fallback to full list if no query given

    response = es_client.search(
        index=QUESTIONS_INDEX,
        query={
            "bool": {
                "must": [
                    {"match": {"text": query_text}}
                ],
                "filter": [
                    {"term": {"session_invite_code": invite_code}}
                ]
            }
        }
    )
    matched_ids = [hit["_source"]["id"] for hit in response["hits"]["hits"]]
    return Question.objects.filter(id__in=matched_ids)