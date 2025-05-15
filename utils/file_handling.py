import os
from werkzeug.utils import secure_filename # type: ignore

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    """Yalnızca geçerli dosya uzantılarının yüklendiğinden emin olur"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
