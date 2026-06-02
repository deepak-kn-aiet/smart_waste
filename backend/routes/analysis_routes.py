import os
from flask import Blueprint, request
from werkzeug.utils import secure_filename
from services.gemini_service import GeminiService
from utils.response_helper import success_response, error_response

analysis_bp = Blueprint('analysis', __name__)
gemini_service = GeminiService()

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@analysis_bp.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return error_response("No image part in the request", 400)
    
    file = request.files['image']
    
    if file.filename == '':
        return error_response("No image selected for uploading", 400)
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        try:
            analysis_result = gemini_service.analyze_waste(filepath)
            # Cleanup uploaded file after analysis
            os.remove(filepath)
            return success_response(analysis_result)
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            return error_response(f"Analysis failed: {str(e)}", 500)
    
    return error_response("Allowed image types are png, jpg, jpeg, webp", 400)
