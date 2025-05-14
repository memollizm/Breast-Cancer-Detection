import os
import cv2 # type: ignore
import numpy as np # type: ignore
from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS  # type: ignore
from werkzeug.utils import secure_filename # type: ignore
from tensorflow.keras.models import load_model # type: ignore
import base64

app = Flask(__name__)
CORS(app) 

# Konfigürasyonlar
UPLOAD_FOLDER = r'C:\Users\PC\Desktop\breast_cancer_app_uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MODEL_PATH = 'models/resnet50_unet_breast_cancer.h5'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# Modeli yükle
model = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_segmentation_model():
    global model
    if model is None:
        print("Model yükleniyor...")
        model = load_model(MODEL_PATH)
        print("Model başarıyla yüklendi")
    return model

def preprocess_image(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Görüntü yüklenemedi")
    
    img = cv2.resize(img, (256, 256))
    img = img / 255.0
    img = np.expand_dims(img, axis=-1)
    img = np.expand_dims(img, axis=0)
    img_rgb = np.repeat(img, 3, axis=-1)
    return img_rgb

def create_segmentation_mask(prediction):
    # Tahmin maskesini oluştur (3 sınıf için)
    mask = np.argmax(prediction, axis=-1)
    mask = np.squeeze(mask)  # Batch boyutunu kaldır
    
    # Renkli maske oluştur
    color_mask = np.zeros((*mask.shape, 3), dtype=np.uint8)
    color_mask[mask == 0] = [0, 0, 255]    # Normal - Mavi
    color_mask[mask == 1] = [0, 255, 0]    # İyi Huylu - Yeşil
    color_mask[mask == 2] = [255, 0, 0]    # Kötü Huylu - Kırmızı
    
    # PNG'ye çevir
    _, buffer = cv2.imencode('.png', color_mask)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return f"data:image/png;base64,{img_base64}"

@app.route('/segmentation', methods=['POST'])
def segment_image():
    if 'file' not in request.files:
        return jsonify({'error': 'Dosya yüklenmedi'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Dosya seçilmedi'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Geçersiz dosya formatı'}), 400
    
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        model = load_segmentation_model()
        processed_img = preprocess_image(filepath)
        # Tahmin yap
        prediction = model.predict(processed_img)
        
        # Maske oluştur
        mask = np.argmax(prediction, axis=-1)[0]  # Ana maskeyi al
        
        # Renkli görsel oluştur
        color_mask = np.zeros((*mask.shape, 3), dtype=np.uint8)
        color_mask[mask == 0] = [0, 0, 255]    # Normal - Mavi
        color_mask[mask == 1] = [0, 255, 0]    # İyi Huylu - Yeşil
        color_mask[mask == 2] = [255, 0, 0]    # Kötü Huylu - Kırmızı
        
        # Orijinal görüntüyü maskeyle birleştir (isteğe bağlı)
        original_img = (processed_img[0,...,0] * 255).astype(np.uint8)
        original_img = cv2.cvtColor(original_img, cv2.COLOR_GRAY2BGR)
        blended = cv2.addWeighted(original_img, 0.5, color_mask, 0.5, 0)
        
        # PNG formatında base64'e çevir
        _, buffer = cv2.imencode('.png', blended)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Kontroller
        print(f"Oluşturulan görüntü boyutu: {len(img_base64)} karakter")
        print(f"Base64 başlangıcı: {img_base64[:50]}")
        
        return jsonify({
            'status': 'success',
            'prediction': f"data:image/png;base64,{img_base64}",
            'message': 'Segmentasyon başarılı'
        })
        
    except Exception as e:
        print(f"Hata oluştu: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e),
            'message': 'Segmentasyon sırasında hata'
        }), 500

if __name__ == '__main__':
    print("FLASK API Running")
    app.run(host='0.0.0.0', port=5000, debug=True)