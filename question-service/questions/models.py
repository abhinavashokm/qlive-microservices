from django.db import models
from sessions.models import Session

class Question(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='questions')
    author = models.IntegerField()  # user_id
    text = models.CharField(max_length=300)
    is_answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
