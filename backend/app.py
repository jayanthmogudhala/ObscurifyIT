# Backend (Flask App): app.py
from flask import Flask, request, jsonify
import os
import base64
from io import BytesIO
from PIL import Image
from redaction_code.detect_faces import detect_faces
from redaction_code.redact_regions import redact_regions

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['image']
    if file:
        image_path = "temp_image.jpg"
        redacted_image_path = "redacted_image.jpg"
        file.save(image_path)
        
        # Detect and redact sensitive data
        faces = detect_faces(image_path)
        redact_regions(image_path, faces, redacted_image_path, mode='blur', blur_radius=25)
        
        # Convert redacted image to Base64
        with open(redacted_image_path, "rb") as img_file:
            redacted_image_base64 = base64.b64encode(img_file.read()).decode('utf-8')
        
        # Cleanup temporary files
        os.remove(image_path)
        os.remove(redacted_image_path)
        
        return jsonify({"redactedImage": redacted_image_base64}), 200
    
    return jsonify({"error": "File upload failed"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)