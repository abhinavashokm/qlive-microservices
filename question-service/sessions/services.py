import random
import string
from .models import Session
from .constants import INVITE_CODE_LENGTH
from common.exceptions import NotFoundError

def generate_invite_code():
    """Generates a random alphanumeric invite code of configured length."""
    # use uppercase letters only for the invite code
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=INVITE_CODE_LENGTH))

def create_session(title: str, host_id: int) -> Session:
    """Creates a new session for the given host."""
    session = Session.objects.create(title=title, host=host_id, invite_code=generate_invite_code())
    return session

def get_my_sessions(host_id: int):
    """Retrieves all sessions created by the given host."""
    return Session.objects.filter(host=host_id).order_by('-created_at')

def get_active_session_by_code(invite_code: str) -> Session:
    """Retrieves an active session by its invite code, raising NotFoundError if invalid."""
    try:
        print(f"Looking for session with invite code: {invite_code}")
        sessions = Session.objects.all()
        for session in sessions:
            print(f"Session: {session.title}, Invite Code: {session.invite_code}, Is Active: {session.is_active}")
            
        return Session.objects.get(invite_code=invite_code, is_active=True)
    except Session.DoesNotExist:
        raise NotFoundError("Invalid or expired invite link")
