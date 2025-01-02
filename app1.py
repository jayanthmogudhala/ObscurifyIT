from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import pytesseract
import cv2
import re
import os
import tempfile
import io
import pdfplumber
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import re
import spacy
from flask import Flask, request, jsonify, send_file
import numpy as np
import pandas as pd
import tensorflow.compat.v1 as tf
import pickle
import os
tf.disable_v2_behavior()
from flask_cors import CORS     
import tempfile

from textwrap import wrap
from flask import Flask, request, render_template, send_file
from werkzeug.utils import secure_filename

from flask_cors import CORS
from flask import Flask, request, jsonify, send_file
from PIL import Image, ImageDraw, ImageFilter

app = Flask(__name__)
CORS(app,origins=["http://localhost:3001"])  # Enable CORS to allow communication with the React frontend

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'

# Ensure upload and processed directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

# Allowed file extensions for validation
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf', 'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Define regex patterns for sensitive information
sensitive_patterns = {
    'Aadhaar Number': r'\b\d{4}\s\d{4}\s\d{4}\b',  # Matches Aadhaar number (12 digits grouped by spaces)
    'PAN Card Number': r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b',  # Matches Indian PAN number format (e.g., HCJPD1913B)
    'Date of Birth': r'\b\d{2}/\d{2}/\d{4}\b',  # Matches DOB in DD/MM/YYYY format (e.g., 28/10/1990)
    'Name': r'\b[A-Z][a-z]+\s[A-Z][a-z]+\b',  # Matches names with first and last name (e.g., Kumar Mahesh)
    'Address': r'(Road|Street|St|Rd|Avenue|Pashan|Block|Hotel|Residency|House|Row|Near|Pune)',  # Matches address keywords
}

nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(input_pdf_file):
    """Extract text from a PDF file using pdfplumber."""
    text_by_page = []
    with pdfplumber.open(input_pdf_file) as pdf:
        for page in pdf.pages:
            text_by_page.append(page.extract_text())
    return text_by_page

def redact_with_regex(text, redacted_entities=None):
    """Redact sensitive words based on regular expressions."""
    if redacted_entities is None:
        redacted_entities = {}

    # Define patterns for sensitive data
    patterns = {
        "names": r"\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b",  # Matches names like "John Doe"
        "age": r"\b\d{1,3}-?year-old\b",  # Matches age descriptions like "45-year-old"
        "locations": r"\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b(Village|City|Clinic|Center)",  # Matches locations
        "emails": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",  # Matches email addresses
        "phone_numbers": r"\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b",  # Matches phone numbers
    }

    # Track and redact entities consistently
    def replace_with_redacted(match):
        entity = match.group(0)
        if entity not in redacted_entities:
            redacted_entities[entity] = "[REDACTED]"
        return redacted_entities[entity]

    # Apply patterns to redact sensitive data
    for pattern in patterns.values():
        text = re.sub(pattern, replace_with_redacted, text)

    return text, redacted_entities

def redact_with_ner(text, redacted_entities=None):
    """Redact sensitive named entities using NER."""
    if redacted_entities is None:
        redacted_entities = {}

    # Use SpaCy NER to identify entities like persons, organizations, and locations
    doc = nlp(text)

    for ent in doc.ents:
        if ent.label_ in ["PERSON", "ORG", "GPE"]:  # Redact persons, organizations, and places
            if ent.text not in redacted_entities:
                redacted_entities[ent.text] = "[REDACTED]"
            text = text.replace(ent.text, redacted_entities[ent.text])

    return text, redacted_entities

def write_redacted_text_to_pdf(text_by_page):
    """Write redacted text to a new PDF with proper text wrapping."""
    packet = io.BytesIO()
    c = canvas.Canvas(packet, pagesize=letter)

    page_width, page_height = letter
    margin = 30
    line_height = 14  # Slightly reduced line height
    max_width = page_width - 2 * margin
    y_position = page_height - margin  # Start writing near the top

    for page_number, page_text in enumerate(text_by_page):
        lines = page_text.split("\n")

        for line in lines:
            # Wrap text to fit within the page width
            wrapped_lines = wrap(line, width=int(max_width / 7))  # Approx 7 chars per cm
            for wrapped_line in wrapped_lines:
                if y_position < margin + line_height:  # New page if text goes below margin
                    c.showPage()
                    y_position = page_height - margin
                c.drawString(margin, y_position, wrapped_line)
                y_position -= line_height

        c.showPage()  # Ensure a new page starts after each text page

    c.save()

    # Return the redacted PDF as a byte stream
    return packet.getvalue()

def redact_pdf(input_pdf_file):
    """Redact sensitive information from a PDF."""
    # Extract text from the PDF
    text_by_page = extract_text_from_pdf(input_pdf_file)

    # Redact sensitive information
    redacted_entities = {}
    redacted_pages = []
    for page_text in text_by_page:
        # First, redact using regex
        redacted_page, redacted_entities = redact_with_regex(page_text, redacted_entities)
        
        # Then, apply NER-based redaction
        redacted_page, redacted_entities = redact_with_ner(redacted_page, redacted_entities)
        redacted_pages.append(redacted_page)

    # Create a redacted PDF from the redacted text
    return write_redacted_text_to_pdf(redacted_pages)

app = Flask(__name__)
CORS(app)

def detect_sensitive_text(image_path):
    """Detect sensitive text regions using Tesseract OCR."""
    image = Image.open(image_path)
    ocr_data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
    sensitive_boxes = []
    for i, text in enumerate(ocr_data['text']):
        for label, pattern in sensitive_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                x, y, w, h = ocr_data['left'][i], ocr_data['top'][i], ocr_data['width'][i], ocr_data['height'][i]
                sensitive_boxes.append((x, y, w, h))
    return sensitive_boxes

def detect_faces(image_path):
    """Detect faces in an image using Haar Cascade."""
    gray_image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(
        gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40)
    )
    return faces

def get_redaction_boundary(level, face_x, face_y, face_w, face_h):
    """Get the redaction boundary based on the chosen level."""
    if level == 'Low':
        return (face_x, face_y, face_x + face_w, face_y + face_h)  # Simple face region
    elif level == 'Moderate':
        return (face_x - int(face_w * 0.3), face_y - int(face_h * 0.4), face_x + face_w + int(face_w * 0.3), face_y + face_h + int(face_h * 0.5))  # Face + shoulders
    elif level == 'High':
        return (face_x - int(face_w * 0.5), face_y - int(face_h * 0.5), face_x + face_w + int(face_w * 0.5), face_y + face_h + int(face_h * 0.7))  # Face + torso
    else:
        raise ValueError("Invalid level. Please choose 'Low', 'Moderate', or 'High'.")

def redact_regions(image_path, faces, sensitive_text_boxes, output_path, blur_radius=15, redaction_level='High'):
    """Redact sensitive text and face regions in an image based on the chosen redaction level."""
    image = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(image)

    # Iterate over detected faces
    for (x, y, w, h) in faces:
        redaction_boundary = get_redaction_boundary(redaction_level, x, y, w, h)
        face_region = image.crop(redaction_boundary)
        blurred_face = face_region.filter(ImageFilter.GaussianBlur(radius=blur_radius))
        image.paste(blurred_face, redaction_boundary[:2])

    # Redact sensitive text regions
    for (x, y, w, h) in sensitive_text_boxes:
        region = image.crop((x, y, x + w, y + h))
        blurred_region = region.filter(ImageFilter.GaussianBlur(radius=blur_radius))
        image.paste(blurred_region, (x, y))

    # Save the redacted image
    image.save(output_path)
    return output_path

BEST_GENERATOR_FILE = r"C:\Users\mogud\Downloads\best_generator_perf_0.73.pkl"

# Load the generator's weights
def load_generator(weights_file, z_dim, dim):
    # Placeholder for random input
    Z = tf.placeholder(tf.float32, shape=[None, z_dim])

    # Define generator architecture
    def generator(z):
        G_W1 = tf.Variable(tf.zeros([z_dim, 4 * dim]), name='G_W1')
        G_b1 = tf.Variable(tf.zeros([4 * dim]), name='G_b1')
        G_W2 = tf.Variable(tf.zeros([4 * dim, 4 * dim]), name='G_W2')
        G_b2 = tf.Variable(tf.zeros([4 * dim]), name='G_b2')
        G_W3 = tf.Variable(tf.zeros([4 * dim, dim]), name='G_W3')
        G_b3 = tf.Variable(tf.zeros([dim]), name='G_b3')

        G_h1 = tf.nn.tanh(tf.matmul(z, G_W1) + G_b1)
        G_h2 = tf.nn.tanh(tf.matmul(G_h1, G_W2) + G_b2)
        G_out = tf.nn.sigmoid(tf.matmul(G_h2, G_W3) + G_b3)

        return G_out

    # Initialize session
    G_sample = generator(Z)
    sess = tf.compat.v1.Session()
    sess.run(tf.global_variables_initializer())

    # Restore weights
    with open(weights_file, "rb") as f:
        best_generator_weights = pickle.load(f)
    print("Variables in the model:")
    for var in tf.global_variables():
        print(f"{var.name} (initial value): {sess.run(var)}")

    print("Keys in the pickle file:")
    for key in best_generator_weights.keys():
        print(key)
    
    for var in tf.global_variables():
        var_name = var.name.split(":")[0] 
        if var_name in best_generator_weights:
            weight_shape = best_generator_weights[var_name].shape
            if var.shape == weight_shape:
                print(f"Assigning weight to {var_name}")
                sess.run(var.assign(best_generator_weights[var_name]))
            else:
                print(f"Skipping {var_name} due to shape mismatch: {var.shape} vs {weight_shape}")
        else:
            print(f"WARNING: No weight found for {var.name}")

    return sess, G_sample, Z

# Initialize generator
z_dim = 27 # Define this based on your model
dim = 27    # Define this based on your model
sess, G_sample, Z = load_generator(BEST_GENERATOR_FILE, z_dim, dim)


@app.route('/redact_image', methods=['POST'])
def upload_image():
    try:
        # Check if a file was uploaded
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']

        # Check if the user provided a valid file
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            file.save(temp_file.name)  # Save the uploaded file
            temp_file.flush()  # Ensure all data is written
            temp_file_path = temp_file.name

        # Get the redaction level from the request
        redaction_level = request.form.get('redaction_level', 'High').capitalize()

        # Detect sensitive text and faces
        sensitive_text_boxes = detect_sensitive_text(temp_file_path)
        faces = detect_faces(temp_file_path)

        # Create output path for the redacted image
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as output_file:
            redacted_image_path = redact_regions(
                temp_file_path, faces, sensitive_text_boxes, output_path=output_file.name, blur_radius=20, redaction_level=redaction_level
            )
            output_file.flush()  # Ensure all data is written to the output file

        # Send the redacted file as a download
        return send_file(
            redacted_image_path,
            mimetype='image/jpeg/png',
            as_attachment=True,
            download_name='redacted_image.jpg'
        )

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    finally:
        # Cleanup temporary files
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.route('/redact_pdf', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        # Redact PDF in memory
        redacted_pdf = redact_pdf(file)

        # Send the redacted PDF back to the user for download
        return send_file(io.BytesIO(redacted_pdf), as_attachment=True, download_name=f"redacted_{filename}", mimetype="application/pdf")

    return "Invalid file format. Only PDFs are allowed.", 400

def allowed_file(filename):
    """Check if the uploaded file is a valid PDF."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf'}

@app.route('/generate_synthetic_data', methods=['POST'])
def generate_synthetic():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    # Get uploaded file
    file = request.files["file"]
    input_data = pd.read_csv(file)

    # Generate synthetic data
    no, dim = input_data.shape
    random_input = np.random.uniform(-1., 1., size=[no, z_dim])
    print(f"Random input shape: {random_input.shape}")
    synthetic_data = sess.run(G_sample, feed_dict={Z: random_input})
    print(f"Synthetic data shape: {synthetic_data.shape}")
    # Ensure synthetic data matches input data's column count

    if synthetic_data.shape[1] != len(input_data.columns):
        print("Adjusting synthetic data columns...")
        if synthetic_data.shape[1] > len(input_data.columns):  # Extra columns
            synthetic_data = synthetic_data[:, :len(input_data.columns)]
        else:  # Missing columns
            missing_cols = len(input_data.columns) - synthetic_data.shape[1]
            additional_data = np.zeros((synthetic_data.shape[0], missing_cols))
            synthetic_data = np.hstack((synthetic_data, additional_data))

    # Create the synthetic DataFrame
    synthetic_df = pd.DataFrame(synthetic_data, columns=input_data.columns)
    print(f"Synthetic data saved to DataFrame with shape: {synthetic_df.shape}")


   
    # Save to CSV
    with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp_file:
        tmp_file_path = tmp_file.name
        synthetic_df.to_csv(tmp_file_path, index=False)
        print(f"Synthetic data saved as temporary file at {tmp_file_path}")

    # Return the file to the user
    return send_file(tmp_file_path, as_attachment=True, download_name="synthetic_data.csv", mimetype="text/csv")

def process_file(file_type, input_path):
    """
    Simulates file processing based on the file type.
    For actual implementation, replace this function with redaction logic.
    """
    output_path = os.path.join(app.config['PROCESSED_FOLDER'], f"processed_{os.path.basename(input_path)}")

    # Example logic for different file types
    try:
        if file_type == 'image':
            # Dummy image processing logic
            with open(output_path, 'wb') as f_out:
                f_out.write(b"This is a placeholder for processed image data.")
        elif file_type == 'pdf':
            # Dummy PDF processing logic
            with open(output_path, 'wb') as f_out:
                f_out.write(b"This is a placeholder for processed PDF data.")
        elif file_type == 'csv':
            # Dummy synthetic data generation logic
            with open(output_path, 'w') as f_out:
                f_out.write("ID,Name,Age\n1,John Doe,30\n2,Jane Smith,25\n")
        else:
            return None
    except Exception as e:
        print(f"Error processing file: {e}")
        return None

    return output_path

if __name__ == '__main__':
    app.run(debug=True)
 








