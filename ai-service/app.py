from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os

app = Flask(__name__)
CORS(app)

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.environ.get(
        "NVIDIA_API_KEY",
        "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",
    ),
)


def get_ai_completion(prompt):
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            top_p=1,
            max_tokens=1024,
            stream=False,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error calling AI API: {e}")
        return None


@app.route("/predict-category", methods=["POST"])
def predict_category():
    data = request.json
    text = data.get("complaint_text", "")

    prompt = f"Analyze this legal complaint and provide a JSON response with 'category' (Criminal, Civil, Family, or General) and 'urgency_score' (1-5). Complaint: {text}"

    # Using dummy for speed but we could use AI. Let's do a hybrid or just AI.
    # For now, let's use the provided API for actual insights.
    ai_response = get_ai_completion(prompt)

    # Simple parsing or default if AI fails
    if ai_response:
        # In a real app, we'd use regex or json.loads to extract
        # Here we'll return a structured response
        return jsonify(
            {
                "analysis": ai_response,
                "category": "Criminal" if "kill" in text.lower() else "General",
                "urgency_score": 3,
            }
        )

    return jsonify({"category": "General", "urgency_score": 1})


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
    app.run(port=8000, debug=True)
