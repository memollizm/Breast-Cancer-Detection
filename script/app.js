// Kullanıcının yüklediği görseli okur ve kutulara önizleme olarak ekler
function handleUpload() {
    const fileInput = document.getElementById('imageInput');
    const classificationDiv = document.getElementById('classificationResult');
    const segmentationDiv = document.getElementById('segmentationResult');

    if (!fileInput.files.length) {
        alert("Lütfen bir görüntü seçin.");
        return;
    }

    const imageFile = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const imageHTML = `<img src="${e.target.result}" alt="Yüklenen Görsel" />`;

        // Görseli her iki kutuda da göster (demo)
        classificationDiv.innerHTML = imageHTML;
        segmentationDiv.innerHTML = imageHTML;

        // Simülasyon amaçlı tahmini doğruluk güncelle (gerçek değer Flask'tan gelir)
        updateAccuracyDisplay(84.6); // <- bu değeri backend'den alacaksın
    };

    reader.readAsDataURL(imageFile);
}

// Model doğruluk kutusunu güncelleyen fonksiyon
function updateAccuracyDisplay(accuracyValue) {
    const accuracySpan = document.getElementById("modelAccuracy");
    accuracySpan.innerText = `%${accuracyValue.toFixed(2)}`;
}
