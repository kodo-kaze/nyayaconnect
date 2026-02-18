from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import json
import re

app = Flask(__name__)
CORS(app)

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.environ.get("NVIDIA_API_KEY"),
)

def get_ai_completion(prompt):
    if not client.api_key:
        print("Error: NVIDIA_API_KEY not set")
        return None
    try:
        completion = client.chat.completions.create(
            model="meta/llama-3.1-405b-instruct",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            top_p=0.7,
            max_tokens=1024,
            stream=False,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error calling AI API: {e}")
        return None

def extract_json(text):
    try:
        # Try to find JSON block
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return json.loads(text)
    except:
        return None

@app.route("/predict-category", methods=["POST"])
def predict_category():
    data = request.json
    text = data.get("complaint_text", "")

    prompt = f"""Analyze this legal complaint for the Indian Judicial system. 
Return ONLY a JSON object with the following keys:
"category": (One of: Criminal, Civil, Family, or General)
"urgency_score": (Integer from 1 to 10)
"justification": (Short string explaining why)

Complaint: {text}"""

    ai_response = get_ai_completion(prompt)
    
    # Default values
    result = {
        "category": "General",
        "urgency_score": 3,
        "justification": "Default categorization due to analysis failure."
    }

    if ai_response:
        parsed = extract_json(ai_response)
        if parsed:
            result["category"] = parsed.get("category", result["category"])
            result["urgency_score"] = parsed.get("urgency_score", result["urgency_score"])
            result["justification"] = parsed.get("justification", ai_response[:200])
            result["analysis"] = ai_response
        else:
            # Fallback keyword matching if JSON parsing fails
            lower_text = text.lower()
            if any(word in lower_text for word in ["kill", "theft", "murder", "robbery", "assault"]):
                result["category"] = "Criminal"
                result["urgency_score"] = 8
            elif any(word in lower_text for word in ["divorce", "custody", "marriage", "alimony"]):
                result["category"] = "Family"
                result["urgency_score"] = 5
            elif any(word in lower_text for word in ["property", "contract", "rent", "debt"]):
                result["category"] = "Civil"
                result["urgency_score"] = 4
            result["analysis"] = ai_response

    return jsonify(result)


@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    text = data.get("full_case_text", "")

    prompt = f"Provide a concise summary of this legal case text: {text}"
    summary = get_ai_completion(prompt)

    return jsonify({"summary": summary or "Summary unavailable."})


@app.route("/get-legal-insight", methods=["POST"])
def get_legal_insight():
    data = request.json
    text = data.get("complaint_text", "")

    prompt = f"As a legal assistant for the Indian Judicial system, analyze the following complaint and suggest relevant IPC (Indian Penal Code) or BNS (Bharatiya Nyaya Sanhita) sections and a brief explanation of the legal path. Complaint: {text}"

    insight = get_ai_completion(prompt)
    return jsonify({"legal_insight": insight})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
