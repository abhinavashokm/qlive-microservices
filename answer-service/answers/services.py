from .models import Answer
from common.exceptions import NotFoundError

def get_answer_for_question(question_id: int) -> Answer:
    """Retrieves an answer by question_id or raises a NotFoundError."""
    try:
        return Answer.objects.get(question_id=question_id)
    except Answer.DoesNotExist:
        raise NotFoundError('Answer not found.')

def submit_answer(question_id: int, text: str, host_id: int) -> tuple[Answer, bool]:
    """
    Submits an answer for a question.
    Creates it if it does not exist, or updates it if it does.
    Returns a tuple (answer, created_boolean).
    """
    # TODO: host check: strictly verify caller is the host of the question's session — implemented separately by hand
    
    answer, created = Answer.objects.get_or_create(question_id=question_id)
    answer.text = text
    answer.save()
    
    if created:
        # TODO: publish answer.posted event to RabbitMQ — implemented separately by hand
        pass

    return answer, created
