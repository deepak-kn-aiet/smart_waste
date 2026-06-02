class PlannerService:
    @staticmethod
    def generate_plan(data):
        """
        Generates a waste segregation plan based on input quantities.
        """
        plan = {}
        
        if data.get('plastic'):
            plan["Blue Bin"] = data['plastic']
        if data.get('paper'):
            plan["Paper Recycling"] = data['paper']
        if data.get('organic'):
            plan["Green Bin"] = data['organic']
        if data.get('ewaste'):
            plan["E-Waste Center"] = data['ewaste']
            
        return plan
