from django.core.management.base import BaseCommand
from questions.elasticsearch_client import es_client, QUESTIONS_INDEX

class Command(BaseCommand):
    help = "Creates the Elasticsearch index for questions"

    def handle(self, *args, **options):
        if es_client.indices.exists(index=QUESTIONS_INDEX):
            self.stdout.write("Index already exists")
            return

        es_client.indices.create(
            index=QUESTIONS_INDEX,
            mappings={
                "properties": {
                    "id": {"type": "integer"},
                    "text": {"type": "text"},         # full-text searchable field
                    "session_invite_code": {"type": "keyword"},  # exact-match field, for filtering by session
                }
            }
        )
        self.stdout.write("Index created")