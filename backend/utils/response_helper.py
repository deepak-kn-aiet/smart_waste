from flask import jsonify

def success_response(data, message="Success", status_code=200):
    """Generic success response helper."""
    response = {
        "success": True,
        "message": message,
        "data": data
    }
    return jsonify(response), status_code

def error_response(message="An error occurred", status_code=400, errors=None):
    """Generic error response helper."""
    response = {
        "success": False,
        "message": message
    }
    if errors:
        response["errors"] = errors
    return jsonify(response), status_code
