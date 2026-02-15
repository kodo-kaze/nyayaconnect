# NyayaConnect AI Service

The AI Service is a Python-based microservice that provides legal intelligence and automated case analysis for the NyayaConnect platform. It uses Flask to expose endpoints for complaint categorization, law suggestions, and text summarization.

## Features

- **Complaint Categorization:** Automatically classifies complaints into categories like Criminal, Civil, or Family and assigns an urgency score.
- **Law Suggestions:** Suggests relevant legal sections (e.g., IPC) based on the complaint text.
- **Case Summarization:** Generates concise summaries of long case documents.
- **Priority Scoring:** Determines case priority levels to help judicial officials manage their workload.

## Tech Stack

- **Language:** Python 3
- **Framework:** Flask
- **CORS Handling:** Flask-CORS

## Getting Started

### Prerequisites

- Python 3.x
- `pip` (Python package installer)
- `venv` (optional but recommended)

### Installation

1. Navigate to the `ai-service` directory:
   ```bash
   cd ai-service
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Service

Start the Flask server:
```bash
python app.py
```
The service will be available at `http://localhost:8000`.

## API Endpoints

### 1. Predict Category
- **Endpoint:** `/predict-category`
- **Method:** `POST`
- **Payload:** `{"complaint_text": "string"}`
- **Response:** `{"category": "string", "urgency_score": integer}`

### 2. Suggest Sections
- **Endpoint:** `/suggest-sections`
- **Method:** `POST`
- **Payload:** `{"complaint_text": "string"}`
- **Response:** `{"probable_laws": ["string"]}`

### 3. Summarize Case
- **Endpoint:** `/summarize`
- **Method:** `POST`
- **Payload:** `{"full_case_text": "string"}`
- **Response:** `{"summary": "string"}`

### 4. Priority Score
- **Endpoint:** `/priority-score`
- **Method:** `POST`
- **Payload:** `{...case_details...}`
- **Response:** `{"priority_level": "string"}`
