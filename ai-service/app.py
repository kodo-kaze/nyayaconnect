from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict-category', methods=['POST'])
def predict_category():
    data = request.json
    text = data.get('complaint_text', '').lower()
    
    category = "General"
    urgency_score = 1
    
    if "kill" in text or "murder" in text or "weapon" in text:
        category = "Criminal"
        urgency_score = 5
    elif "money" in text or "debt" in text or "contract" in text:
        category = "Civil"
        urgency_score = 3
    elif "divorce" in text or "custody" in text:
        category = "Family"
        urgency_score = 4
        
    return jsonify({
        "category": category,
        "urgency_score": urgency_score
    })

@app.route('/suggest-sections', methods=['POST'])
def suggest_sections():
    data = request.json
    text = data.get('complaint_text', '').lower()
    
    laws = ["IPC Section 101"]
    if "theft" in text:
        laws.append("Section 378 (Theft)")
    if "fraud" in text:
        laws.append("Section 420 (Cheating)")
        
    return jsonify({"probable_laws": laws})

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('full_case_text', '')
    summary = text[:200] + "..." if len(text) > 200 else text
    return jsonify({"summary": "Summary: " + summary})

@app.route('/priority-score', methods=['POST'])
def priority_score():
    data = request.json
    # Logic based on case details
    return jsonify({"priority_level": "Medium"})

if __name__ == '__main__':
    app.run(port=8000)
