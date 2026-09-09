import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from questions.services import search_questions
print("Searching for 'a' in DXFGLX:")
print(list(search_questions('DXFGLX', 'a')))
print("Searching for 'aa' in DXFGLX:")
print(list(search_questions('DXFGLX', 'aa')))
