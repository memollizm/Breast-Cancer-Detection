// Dosya seçme butonu event listener
document.getElementById('selectImageBtn').addEventListener('click', function () {
    document.getElementById('imageFile').click();
});

// Dosya seçildiğinde önizleme göster
document.getElementById('imageFile').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        updateFileInfo(file);
        displayImagePreview(file);
    }
});

// Drag and drop işlemleri
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('imageFile');
const fileInfo = document.getElementById('fileInfo');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropZone.classList.add('drag-over');
}

function unhighlight() {
    dropZone.classList.remove('drag-over');
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length) {
        fileInput.files = files;
        updateFileInfo(files[0]);
        displayImagePreview(files[0]);
    }
}

// Dosya bilgilerini güncelle
function updateFileInfo(file) {
    fileInfo.textContent = `Seçilen dosya: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
}

// Görüntü önizlemesi göster
function displayImagePreview(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const classificationResult = document.getElementById('classificationResult');
        classificationResult.innerHTML = '';

        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Yüklenen görüntü';
        img.classList.add('preview-image');

        classificationResult.appendChild(img);

        // Segmentasyon sonucu alanını sıfırla
        document.getElementById('segmentationResult').innerHTML = `
            <div class="placeholder">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Analiz için "Analiz Et" butonuna basın</p>
            </div>
        `;
    };

    reader.readAsDataURL(file);
}

// Segmentasyon sonucunu gösterme fonksiyonu
function displaySegmentationResult(base64Data, container) {
    container.innerHTML = '';

    // Base64 verisini kontrol et
    if (!base64Data.startsWith('data:image/png;base64,')) {
        console.error("Geçersiz base64 görüntü formatı");
        showError('Geçersiz görüntü formatı alındı', container);
        return;
    }

    // Yeni bir canvas elementi oluştur
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
        // Canvas boyutlarını ayarla
        canvas.width = img.width;
        canvas.height = img.height;

        // Görüntüyü canvas'a çiz
        ctx.drawImage(img, 0, 0);

        // Canvas'tan PNG verisini al (isteğe bağlı)
        const pngData = canvas.toDataURL('image/png');
        console.log("PNG verisi oluşturuldu:", pngData.substring(0, 50) + "...");

        // Sonucu container'a ekle
        const resultImg = new Image();
        resultImg.src = pngData;
        resultImg.alt = 'Segmentasyon Sonucu';
        resultImg.style.maxWidth = '100%';
        resultImg.style.maxHeight = '300px';
        resultImg.style.display = 'block';
        resultImg.style.margin = '0 auto';

        container.appendChild(resultImg);
    };

    img.onerror = function () {
        console.error("Görüntü yükleme hatası");
        showError('Görüntü yüklenirken hata oluştu', container);
    };

    img.src = base64Data;
}

// Analiz butonu event listener'ı
document.getElementById('analyzeBtn').addEventListener('click', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('imageFile');
    const segmentationResult = document.getElementById('segmentationResult');

    if (!fileInput.files || fileInput.files.length === 0) {
        showError('Lütfen önce bir görüntü seçin', segmentationResult);
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Yükleme durumunu göster
        segmentationResult.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <p>Görüntü analiz ediliyor...</p>
            </div>
        `;

        const response = await fetch('http://10.14.11.96:5000/segmentation', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP Hatası! Durum: ${response.status}`);
        }

        const data = await response.json();

        if (data.prediction) {
            displaySegmentationResult(data.prediction, segmentationResult);
        } else {
            throw new Error('API geçersiz yanıt formatı döndürdü');
        }
    } catch (error) {
        console.error("Hata:", error);
        showError(error.message, segmentationResult);
    }
});

function showError(message, container) {
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}

// Modal işlemleri (eğer kullanıyorsanız)
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');

if (modal && modalImg && closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}