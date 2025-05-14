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
    const uploadContentDiv = document.querySelector('#dropZone .upload-content'); // Yeni hedef

    if (!uploadContentDiv) {
        console.error("Yükleme alanı (.upload-content) bulunamadı!");
        return;
    }

    reader.onload = function (e) {
        uploadContentDiv.innerHTML = ''; // Yükleme alanının mevcut içeriğini temizle

        // Dosya adını göster
        const fileNameParagraph = document.createElement('p');
        fileNameParagraph.textContent = `Yüklenen Dosya: ${file.name}`;
        fileNameParagraph.style.fontSize = '0.9em';
        fileNameParagraph.style.marginBottom = '10px';
        fileNameParagraph.style.color = '#555';
        uploadContentDiv.appendChild(fileNameParagraph);

        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Yüklenen görüntünün önizlemesi';
        img.classList.add('preview-image');
        // Önizleme resminin yükleme kutusuna sığması için stiller
        img.style.maxWidth = '100%';
        img.style.maxHeight = '150px'; // Yüksekliği biraz daha az tutalım
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        img.style.margin = '0 auto 10px auto'; // Altına buton için biraz boşluk

        uploadContentDiv.appendChild(img);

        // "Görüntüyü Değiştir" butonu ekle
        const changeImageBtn = document.createElement('button');
        changeImageBtn.type = 'button';
        changeImageBtn.textContent = 'Görüntüyü Değiştir';
        changeImageBtn.classList.add('upload-btn'); // Mevcut buton stilini kullanalım
        changeImageBtn.style.fontSize = '0.9em'; // Butonu biraz küçültebiliriz
        changeImageBtn.style.padding = '8px 12px';
        changeImageBtn.addEventListener('click', () => {
            document.getElementById('imageFile').click(); // Gizli dosya girişini tetikle
        });
        uploadContentDiv.appendChild(changeImageBtn);

        // fileInfo elementini (eğer varsa) temizle, çünkü artık önizleme alanında gösteriyoruz
        const fileInfoElement = document.getElementById('fileInfo');
        if (fileInfoElement) {
            fileInfoElement.textContent = ''; // Ya da gizleyebiliriz: fileInfoElement.style.display = 'none';
        }

        // Sınıflandırma Sonucu kutucuğunun yer tutucusunu koru
        const classificationResultBox = document.getElementById('classificationResult');
        if (classificationResultBox) {
            // Eğer içi boşsa veya placeholder yoksa, placeholderı tekrar ekle
            if (classificationResultBox.innerHTML.trim() === '' || !classificationResultBox.querySelector('.placeholder')) {
                classificationResultBox.innerHTML = `
                    <div class="placeholder">
                        <i class="fas fa-image"></i>
                        <p>Henüz yükleme yapılmadı</p>
                    </div>`;
            }
        } else {
            console.warn("Sınıflandırma sonuç kutusu (classificationResult) bulunamadı.");
        }

        // Segmentasyon sonucu alanını sıfırla (bu kısım aynı kalıyor)
        const segmentationResultDiv = document.getElementById('segmentationResult');
        if (segmentationResultDiv) {
            segmentationResultDiv.innerHTML = `
                <div class="placeholder">
                    <i class="fas fa-image"></i>
                    <p>Analiz için "Analiz Et" butonuna basın</p>
                </div>
            `;
        }
        console.log("Görüntü önizlemesi yükleme alanında gösterildi. Segmentasyon sonucu sıfırlandı.");
    };

    reader.readAsDataURL(file);
}

// Segmentasyon sonucunu gösterme fonksiyonu
function displaySegmentationResult(base64Data, container) {
    console.log("displaySegmentationResult called with container:", container);
    if (!container) {
        console.error("Container element is null or undefined in displaySegmentationResult.");
        return;
    }
    container.innerHTML = ''; // Konteyneri temizle

    if (!base64Data || !base64Data.startsWith('data:image/png;base64,')) {
        console.error("Geçersiz veya eksik base64 görüntü formatı:", base64Data ? base64Data.substring(0, 30) + "..." : "null");
        showError('Geçersiz veya eksik base64 görüntü formatı alındı.', container);
        return;
    }

    console.log("Valid base64Data received, length:", base64Data.length);

    const resultImg = new Image();
    console.log("New Image object (resultImg) created.");

    resultImg.onload = function () {
        console.log("resultImg.onload triggered. Image loaded successfully.");
        resultImg.alt = 'Segmentasyon Sonucu';
        resultImg.style.maxWidth = '100%';
        resultImg.style.maxHeight = '300px'; // Bu yüksekliği ihtiyaca göre ayarlayabilirsiniz
        resultImg.style.display = 'block';
        resultImg.style.margin = '0 auto';
        container.appendChild(resultImg);
        console.log("resultImg appended to container.");
    };

    resultImg.onerror = function (e) {
        console.error("resultImg.onerror triggered. Görüntü yükleme hatası:", e);
        showError('Segmentasyon görüntüsü yüklenirken bir hata oluştu.', container);
    };

    console.log("Setting resultImg.src with base64 data (first 50 chars):", base64Data.substring(0, 50) + "...");
    resultImg.src = base64Data;
}

// Analiz butonu event listener'ı
document.getElementById('analyzeBtn').addEventListener('click', async function (e) {
    e.preventDefault(); // Formun submit edilmesini engelle
    console.log("Analiz Et button clicked. e.preventDefault() called.");

    const fileInput = document.getElementById('imageFile');
    const segmentationResultContainer = document.getElementById('segmentationResult');

    if (!segmentationResultContainer) {
        console.error("segmentationResultContainer not found in DOM!");
        alert("Segmentasyon sonuç alanı bulunamadı. Lütfen sayfa yapısını kontrol edin.");
        return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
        console.warn("No file selected for analysis.");
        showError('Lütfen önce bir görüntü seçin', segmentationResultContainer);
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    console.log("Preparing to fetch. File:", file.name, "Container:", segmentationResultContainer);

    try {
        segmentationResultContainer.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <p>Görüntü analiz ediliyor...</p>
            </div>
        `;
        console.log("Loading spinner displayed in segmentationResultContainer.");

        console.log("Sending POST request to /segmentation API...");
        const response = await fetch('http://localhost:5000/segmentation', {
            method: 'POST',
            body: formData
        });
        console.log("Fetch response received:", response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API response not OK. Status:", response.status, "Response Text:", errorText);
            throw new Error(`API Hatası! Durum: ${response.status}. Mesaj: ${errorText}`);
        }

        console.log("API response is OK. Attempting to parse JSON...");
        const data = await response.json();
        console.log("API response JSON parsed successfully:", data);

        if (data && data.prediction) {
            console.log("data.prediction found. Calling displaySegmentationResult.");
            displaySegmentationResult(data.prediction, segmentationResultContainer);
        } else {
            console.error("API response does not contain 'prediction' field or data is null. Data:", data);
            throw new Error('API yanıtında "prediction" alanı bulunamadı veya veri formatı geçersiz.');
        }
        console.log("analyzeBtn click handler finished successfully.");

    } catch (error) {
        console.error("Hata oluştu (analyzeBtn event listener):", error);
        if (segmentationResultContainer) { // Hata durumunda konteynerin hala var olduğundan emin olalım
            showError(`Bir hata oluştu: ${error.message}`, segmentationResultContainer);
        } else {
            alert(`Bir hata oluştu: ${error.message}. Sonuç konteyneri de bulunamadı.`);
        }
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