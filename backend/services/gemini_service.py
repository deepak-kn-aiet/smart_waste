import os
import json
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def analyze_waste(self, image_path):
        """
        Sends an image to Gemini Vision API and returns waste analysis in JSON format.
        """
        try:
            img = Image.open(image_path)
            
            prompt = """
            Analyze this image of a waste item and provide details in JSON format.
            The user is in India, so provide scrap values and recycling tips relevant to the Indian context (e.g., local Kabadiwala/scrap dealer rates).

            Include:
            - item: Name of the item
            - category: Type of waste (Plastic, Paper, Organic, E-waste, Metal, Glass, etc.)
            - bin: Recommended disposal bin color in India (e.g., Blue for Dry, Green for Wet)
            - recyclable: Boolean
            - confidence: Percentage (0-100)
            - instructions: List of steps to prepare the item for disposal/recycling
            - home_recycling: List of 3-5 creative and practical ways to reuse or recycle this item at home. 
              If the item is hazardous or unsafe to reuse, provide a single string starting with "UNSAFE: [reason]".
            - market_value: Object with:
                - has_value: Boolean (True if it can be sold to local scrap dealers/Kabadiwalas in India)
                - price_per_unit: String (e.g., "₹15–₹25", "₹2–₹5")
                - unit: String (e.g., "kg", "piece", "bottle")
                - earnings_estimate: List of 3 objects with [label: "Quantity", value: "Estimated Price"]. 
                  Example for plastic bottles: [{label: "10 Bottles", value: "₹2-₹5"}, {label: "50 Bottles", value: "₹10-₹25"}, {label: "100 Bottles", value: "₹20-₹50"}]
            - impact: Object with co2_saved (string, e.g., "0.5kg") and benefit (string, e.g., "Prevents ocean pollution")
            
            CRITICAL: Return ONLY the raw JSON object. Do not include any markdown formatting or extra text.
            Ensure market_value.has_value is True for items like: Plastic bottles, Newspapers, Cardboard, Metal cans, Glass bottles, E-waste, Copper wire, etc.
            """
            
            response = self.model.generate_content([prompt, img])
            
            # Extract JSON from response
            text = response.text.strip()
            
            # Robust JSON extraction
            json_str = ""
            # Remove any leading/trailing whitespace
            text = text.strip()
            
            if "```json" in text:
                json_str = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                json_str = text.split("```")[1].split("```")[0].strip()
            else:
                # Try to find the first '{' and last '}'
                start = text.find('{')
                end = text.rfind('}')
                if start != -1 and end != -1:
                    json_str = text[start:end+1]
                else:
                    json_str = text
            
            # Final cleanup of any potential non-json characters
            json_str = json_str.strip()
            
            try:
                data = json.loads(json_str)
                # Ensure essential fields exist to prevent frontend crashes
                if "market_value" not in data:
                    data["market_value"] = {"has_value": False}
                if "home_recycling" not in data:
                    data["home_recycling"] = []
                return data
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error: {e}")
                print(f"Raw text: {text}")
                # Return a fallback object if parsing fails
                return {
                    "item": "Unknown Item",
                    "category": "General",
                    "bin": "Blue Bin",
                    "recyclable": True,
                    "confidence": 0,
                    "instructions": ["Could not analyze properly. Please try again."],
                    "home_recycling": [],
                    "market_value": {"has_value": False},
                    "impact": {"co2_saved": "0kg", "benefit": "N/A"}
                }
            
        except Exception as e:
            print(f"Gemini Service Error: {e}")
            raise e
