from tensorflow.keras.models import load_model # type: ignore
import numpy as np # type: ignore
import cv2 # type: ignore

# Segmentasyon modelini yükle
model = load_model('models/resnet50_unet_breast_cancer.h5')

def predict_segmentation(image_path):
    # Görüntüyü oku
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img_resized = cv2.resize(img, (256, 256))  # Model için gerekli boyut
    img_normalized = np.expand_dims(img_resized, axis=-1) / 255.0  # Normalize etme
    img_rgb = np.repeat(img_normalized, 3, axis=-1)  # RGB'ye dönüştür

    # Modeli çalıştır
    pred = model.predict(np.expand_dims(img_rgb, axis=0))[0]
    pred_mask = np.argmax(pred, axis=-1)

    # Çıktıyı kaydet
    output_path = image_path.replace('uploads', 'outputs')  # Çıktıyı kaydetmek için
    cv2.imwrite(output_path, pred_mask * 255)  # Çıktıyı kaydet

    return output_path  # Segmentasyon çıktısının yolu
