from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# using pretrained model to check the emotions

emotion_classifier = pipeline("text-classification", 
                              model="j-hartmann/emotion-english-distilroberta-base",
                              top_k=None)

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text.strip():
            return jsonify({"error": "Empty text"}), 400

        result = emotion_classifier(text)[0]
        top = max(result, key=lambda x: x['score'])

        return jsonify({
            "emotion": top['label'],
            "confidence": round(top['score'], 3),
            "full_scores": {item['label']: round(item['score'], 3) for item in result}
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Server is starting...")
    app.run(debug=True,port=5000)
    
