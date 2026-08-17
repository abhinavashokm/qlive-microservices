from elasticsearch import Elasticsearch
import os

es_client = Elasticsearch(
    f"http://{os.environ.get('ELASTICSEARCH_HOST', 'localhost')}:9200"
)

QUESTIONS_INDEX = "questions"