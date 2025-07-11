from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text.strip():
            return jsonify({"error": "Empty text"}), 400

        # this is a fake emotion return just for checking 
        return jsonify({
            "emotion": "Anxious",
            "confidence": 0.85
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Server is starting...")
    app.run(debug=True, port=5000)
