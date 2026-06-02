from flask import Blueprint, request
from services.planner_service import PlannerService
from utils.response_helper import success_response, error_response

planner_bp = Blueprint('planner', __name__)

@planner_bp.route('/planner', methods=['POST'])
def planner():
    data = request.get_json()
    
    if not data:
        return error_response("No data provided", 400)
        
    try:
        plan = PlannerService.generate_plan(data)
        return success_response(plan)
    except Exception as e:
        return error_response(f"Planning failed: {str(e)}", 500)
