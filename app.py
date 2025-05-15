import os
import cv2  # type: ignore
import numpy as np  # type: ignore
import base64
from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
from werkzeug.utils import secure_filename  # type: ignore
from tensorflow.keras.models import load_model  # type: ignore

app = Flask(__name__)
CORS(app)

# --- Konfigürasyonlar ---
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
SEG_MODEL_PATH = 'models/resnet50_unet_breast_cancer.h5'
CLS_MODEL_PATH = 'models/cnnBreastCancer.keras'
CLASS_NAMES = ['Normal', 'İyi Huylu', 'Kötü Huylu']

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Global model objeleri ---
segmentation_model = None
classification_model = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_segmentation_model():
    global segmentation_model
    if segmentation_model is None:
        print("Segmentasyon modeli yükleniyor...")
        segmentation_model = load_model(SEG_MODEL_PATH)
        print("Segmentasyon modeli başarıyla yüklendi")
    return segmentation_model

def load_classification_model():
    global classification_model
    if classification_model is None:
        print("Sınıflandırma modeli yükleniyor...")
        classification_model = load_model(CLS_MODEL_PATH)
        print("Sınıflandırma modeli başarıyla yüklendi")
    return classification_model

def preprocess_segmentation(img_gray):
    img = cv2.resize(img_gray, (256, 256), interpolation=cv2.INTER_AREA)
    img = img.astype(np.float32) / 255.0
    img = np.expand_dims(img, axis=-1)           # (256,256,1)
    img = np.repeat(img, 3, axis=-1)             # (256,256,3)
    return np.expand_dims(img, axis=0)           # (1,256,256,3)

def preprocess_classification(img_gray):
    img = cv2.resize(img_gray, (64, 64), interpolation=cv2.INTER_AREA)
    img = img.astype(np.float32) / 255.0
    img = np.expand_dims(img, axis=-1)           # (64,64,1)
    return np.expand_dims(img, axis=0)           # (1,64,64,1)

def encode_image(img_bgr):
    _, buf = cv2.imencode('.png', img_bgr)
    return base64.b64encode(buf).decode('utf-8')

@app.route('/segmentation', methods=['POST'])
def segment_image():
    # --- Dosya kontrolleri ---
    if 'file' not in request.files:
        return jsonify(status='error', message='Dosya yüklenmedi'), 400
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify(status='error', message='Geçersiz dosya'), 400

    try:
        # (Opsiyonel) Güvenli şekilde kaydetmek isterseniz:
        # filename = secure_filename(file.filename)
        # filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        # file.save(filepath)

        # Bellekten oku
        data = file.read()
        arr  = np.frombuffer(data, np.uint8)
        img_gray = cv2.imdecode(arr, cv2.IMREAD_GRAYSCALE)
        if img_gray is None:
            raise ValueError("Görüntü okunamadı")

        # Ön-işleme & tahmin
        inp = preprocess_segmentation(img_gray)
        model = load_segmentation_model()
        pred = model.predict(inp)[0]                # (256,256,3)
        mask = np.argmax(pred, axis=-1)             # (256,256)

        # Renkli maske & karıştırma
        h, w = mask.shape
        color_mask = np.zeros((h, w, 3), dtype=np.uint8)
        color_mask[mask==0] = [0,0,255]
        color_mask[mask==1] = [0,255,0]
        color_mask[mask==2] = [255,0,0]

        orig_bgr = cv2.cvtColor(img_gray, cv2.COLOR_GRAY2BGR)
        orig_bgr = cv2.resize(orig_bgr, (w, h))
        blended = cv2.addWeighted(orig_bgr, 0.5, color_mask, 0.5, 0)

        img_base64 = encode_image(blended)
        return jsonify(status='success',
                       prediction=f"data:image/png;base64,{img_base64}")

    except Exception as e:
        return jsonify(status='error', message=str(e)), 500

@app.route('/classify', methods=['POST'])
def classify_image():
    # --- Dosya kontrolleri ---
    if 'file' not in request.files:
        return jsonify(status='error', message='Dosya yüklenmedi'), 400
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify(status='error', message='Geçersiz dosya'), 400

    try:
        data = file.read()
        arr  = np.frombuffer(data, np.uint8)
        img_gray = cv2.imdecode(arr, cv2.IMREAD_GRAYSCALE)
        if img_gray is None:
            raise ValueError("Görüntü okunamadı")

        inp = preprocess_classification(img_gray)
        model = load_classification_model()
        preds = model.predict(inp)
        # 1×3 veya 3 vektörünü normalize et
        scores = (preds[0] if preds.ndim==2 else preds).tolist()
        idx    = int(np.argmax(scores))
        label  = CLASS_NAMES[idx]

        return jsonify(status='success',
                       label=label,
                       scores=scores)

    except Exception as e:
        return jsonify(status='error', message=str(e)), 500

if __name__ == '__main__':
    print("FLASK API Running")
    app.run(host='0.0.0.0', port=5000, debug=True)
