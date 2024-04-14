from accounts import models

def validate_request_method(request, allowed_methods):
  if request.method not in allowed_methods:    
    raise Exception("Invalid request")
  return None

def validate_auth_token(request):
    try:
        auth_token = request.headers.get('Authorization')
        return models.AuthTokens.objects.get(token=auth_token).user
    except:
        raise Exception("Invalid token")

def missing_fields(fields, data):
    for field in fields:
        if field not in data:
            raise Exception(f"Missing field: {field}")
    return None