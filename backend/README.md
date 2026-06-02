# EcoSort AI Backend

Professional Flask backend for EcoSort AI, powered by Gemini Vision for intelligent waste analysis and segregation.

## Project Structure

```
backend/
├── app.py              # Main entry point
├── routes/             # API route definitions
│   ├── analysis_routes.py
│   └── planner_routes.py
├── services/           # Business logic and external services
│   ├── gemini_service.py
│   └── planner_service.py
├── utils/              # Helper functions
│   └── response_helper.py
├── uploads/            # Temporary storage for analysis
├── requirements.txt    # Dependencies
├── .env                # Environment variables (API Keys)
└── README.md
```

## Setup Instructions

1. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the `backend` folder based on `.env.example`.
   - Add your `GEMINI_API_KEY` (Get one from [Google AI Studio](https://aistudio.google.com/)).

4. **Run the Backend**:
   ```bash
   python app.py
   ```
   The backend will start on `http://localhost:5000`.

## API Documentation

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies if the backend is running.

### 2. Waste Analysis
- **Endpoint**: `POST /api/analyze`
- **Description**: Identifies waste from an image and provides segregation advice.
- **Input**: Form-data with an `image` file.

### 3. Smart Planner
- **Endpoint**: `POST /api/planner`
- **Description**: Generates a segregation plan based on waste quantities.
- **Input**: JSON object with quantities (plastic, paper, organic, ewaste).
