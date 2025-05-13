import os
from werkzeug.utils import secure_filename # type: ignore

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    """Yalnızca geçerli dosya uzantılarının yüklendiğinden emin olur"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file):
    """Dosyayı kaydetmek için güvenli bir dosya adı oluşturur"""
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)  # Güvenli dosya adı
        file_path = os.path.join('uploads', filename)  # Yükleme yolu
        file.save(file_path)  # Dosyayı kaydet
        print(f"Dosya {filename} başarıyla kaydedildi: {file_path}")
        return file_path  # Dosyanın yolu
    else:
        print("Geçersiz dosya formatı.")
        return None
