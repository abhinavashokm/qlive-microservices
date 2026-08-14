from .models import Question
from sessions.services import get_active_session_by_code
from common.exceptions import ForbiddenError, NotFoundError

def list_questions(invite_code: str):
    """Lists all questions for a given active session, ordered by created_at."""
    session = get_active_session_by_code(invite_code)
    # TODO: vote sorting — implemented separately by hand
    return Question.objects.filter(session=session).order_by('created_at')

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
