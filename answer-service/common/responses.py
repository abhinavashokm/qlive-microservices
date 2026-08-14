from rest_framework.response import Response
from rest_framework import status

def success_response(data=None, message=None, status_code=status.HTTP_200_OK):
    payload = {}
    if data is not None:
        payload['data'] = data
    if message:
        payload['message'] = message
    # If no wrapper is desired, we can return data directly, but the prompt
    # implies standardizing a common response formatting. 
    # For now, we just return the raw data or a simple dict if it's a message.
    if data is not None and not message:
        return Response(data, status=status_code)
    return Response(payload, status=status_code)

def error_response(message, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"error": message}, status=status_code)
