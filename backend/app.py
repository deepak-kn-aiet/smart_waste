import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes.analysis_routes import analysis_bp
from routes.planner_routes import planner_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Create uploads folder if not exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# Register Blueprints
app.register_blueprint(analysis_bp, url_prefix='/api')
app.register_blueprint(planner_bp, url_prefix='/api')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "running",
        "service": "EcoSort AI Backend"
    })

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
