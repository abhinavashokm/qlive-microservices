from django.db import models
from sessions.models import Session

class Question(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='questions')
    author = models.IntegerField()  # user_id
    text = models.CharField(max_length=300)
    is_answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    vote_count = models.IntegerField(default=0)

    def __str__(self):
        return self.text


class Vote(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user_id = models.IntegerField()

    class Meta:
        unique_together = ("question", "user_id")