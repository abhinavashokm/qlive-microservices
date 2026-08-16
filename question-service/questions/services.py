from .models import Question, Vote
from sessions.services import get_active_session_by_code
from common.exceptions import ForbiddenError, NotFoundError
from .redis_client import redis_client
from django.db import IntegrityError

def list_questions(invite_code: str):
    """Lists all questions for a given active session, ordered by created_at."""
    session = get_active_session_by_code(invite_code)
    # TODO: vote sorting — implemented separately by hand
    questions = list(Question.objects.filter(session=session).order_by('created_at'))
    for q in questions:
        redis_count = redis_client.get(f"question:{q.id}:votes")
        if redis_count is not None:
            q.vote_count = int(redis_count)
    return questions

def create_question(invite_code: str, text: str, author_id: int) -> Question:
    """Creates a new question within an active session."""
    session = get_active_session_by_code(invite_code)
    return Question.objects.create(session=session, text=text, author=author_id)

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
