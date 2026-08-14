from django.db import models

class Answer(models.Model):
    question_id = models.IntegerField()  # Lives in question-service DB
    text = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer for Q{self.question_id}"
