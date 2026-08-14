from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

class AppError(Exception):
    def __init__(self, message, status_code=status.HTTP_400_BAD_REQUEST):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class NotFoundError(AppError):
    def __init__(self, message="Resource not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

class ForbiddenError(AppError):
    def __init__(self, message="Permission denied"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, AppError):
        return Response({'error': exc.message}, status=exc.status_code)

    return response
