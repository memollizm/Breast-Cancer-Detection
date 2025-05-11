# 🎗️ CellCheck AI - Yapay Zeka Destekli Meme Kanseri Tespit Sistemi

<div align="center">
  <img src="images/logo/CellCheck-Logo.png" alt="Cancer AI Logo" width="200"/>
  
  [![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
  [![Framework](https://img.shields.io/badge/Framework-TensorFlow-orange)](https://www.tensorflow.org/)
</div>

<br>

## 📋 İçindekiler
- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Model Performansı](#-model-performansı)
- [Geliştirici](#-geliştirici)

<br>

## 🎯 Proje Hakkında

CellCheck AI, meme kanseri teşhisinde yapay zeka teknolojisini kullanarak doktorlara yardımcı olan yenilikçi bir web uygulamasıdır. U-Net mimarisi kullanılarak geliştirilen derin öğrenme modeli, ultrason görüntülerini analiz ederek kitleleri tespit eder ve segmentasyon yapar.

<br>

### 🌟 Temel Özellikler
- Ultrason görüntülerinin yapay zeka ile analizi
- Gerçek zamanlı kitle tespiti ve segmentasyonu
- Yüksek doğruluk oranı (%94.5)
- Kullanıcı dostu arayüz
- Detaylı kanser türü bilgilendirmesi

<br>

## 🚀 Özellikler

### 📊 Analiz Özellikleri
- **Görüntü Sınıflandırma**: Ultrason görüntülerini normal/anormal olarak sınıflandırma
- **Segmentasyon**: Kitlelerin otomatik tespiti ve sınırlandırılması
- **Doğruluk Göstergesi**: Model performansının gerçek zamanlı gösterimi

<br>

### 💡 Bilgi Sistemi
- Detaylı kanser türü açıklamaları
- Risk faktörleri analizi
- Erken teşhis önerileri
- İstatistiksel veriler

<br>

## 🛠️ Teknolojiler

### Backend
- Python 3.8+
- TensorFlow 2.x
- U-Net Model Mimarisi
- OpenCV

<br>

### Frontend
- HTML5 & CSS3
- JavaScript (ES6+)
- Font Awesome
- Google Fonts

<br>

## 💻 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/memollizm/Breast-Cancer-Detection.git
cd Breast-Cancer-Detection
```

2. Gerekli paketleri yükleyin:
```bash
pip install -r requirements.txt
```

3. Uygulamayı başlatın:
```bash
python app.py
```

<br>

## 📱 Kullanım

1. Ana sayfada "Görüntü Yükle" butonuna tıklayın
2. Ultrason görüntüsünü seçin veya sürükleyip bırakın
3. "Analiz Et" butonuna tıklayın
4. Sonuçları inceleyin:
   - Sınıflandırma sonucu
   - Segmentasyon görüntüsü
   - Model doğruluk oranı

<br>

## 📈 Model Performansı

| Metrik | Değer |
|--------|--------|
| Segmentasyon Modeli Doğruluğu | %94.5 |
| IoU Skoru | 0.89 |
| İşlem Süresi | 0.8s |
| Veri Seti Boyutu | 2,500+ |

<br>

## 📁 Veri Seti

### Kaynak
- Özel olarak toplanmış meme ultrason görüntüleri
- Toplam 2,500+ görüntü

### Sınıflar
- Normal dokular
- İyi huylu kitleler
- Kötü huylu kitleler

### Ön İşleme
- 64x64 piksele yeniden boyutlandırma
- Gri tonlamaya dönüştürme
- Veri artırma (Data Augmentation)

<br>

## 🏗️ Model Mimarisi

### CNN Model Özellikleri
```
Model: "sequential"
_________________________________________________________________
 Layer (type)                Output Shape              Param #   
=================================================================
 conv2d (Conv2D)             (None, 64, 64, 32)        320       
                                                                 
 max_pooling2d (MaxPooling2D  (None, 32, 32, 32)       0         
 )                                                               
                                                                 
 conv2d_1 (Conv2D)           (None, 32, 32, 32)        9248      
                                                                 
 max_pooling2d_1 (MaxPooling  (None, 16, 16, 32)       0         
 2D)                                                             
                                                                 
 flatten (Flatten)           (None, 8192)              0         
                                                                 
 dense (Dense)               (None, 128)               1048704   
                                                                 
 dense_1 (Dense)             (None, 3)                 387       
                                                                 
=================================================================
Total params: 1,058,659
Trainable params: 1,058,659
Non-trainable params: 0
```

### Önemli Özellikler
- **Giriş Katmanı**: 64x64 gri tonlamalı görüntüler
- **Evrişim Katmanları**:
  - 32 filtreli iki katman
  - ReLU aktivasyon fonksiyonları
  - Max Pooling ile boyut küçültme
- **Dense Katmanları**:
  - 128 nöronlu tam bağlantılı katman
  - 3 sınıflı softmax çıkış katmanı
- **Eğitim Parametreleri**:
  - Optimizer: Adam
  - Loss: Categorical Crossentropy
  - Batch Size: 32
  - Epoch: 25
    
 <br>
 
 
### U-Net Model Özellikleri
- Encoder-Decoder yapısı
- 5 katmanlı U-Net
- Batch Normalization
- Dropout katmanları

<br>

## 👨‍💻 Geliştirici

**Mehmet Başgöze**
- LinkedIn: [Mehmet Başgöze](https://www.linkedin.com/in/mehmetbasgoze/)
- GitHub: [@memollizm](https://github.com/memollizm)

---

<div align="center">
  <sub>Built with ❤️ by Mehmet Başgöze</sub>
</div>
