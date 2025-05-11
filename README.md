# 🎗️ CellCheck AI - Yapay Zeka Destekli Meme Kanseri Tespit Sistemi

<div align="center">
  <img src="images/logo.png" alt="Cancer AI Logo" width="200"/>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
  [![Framework](https://img.shields.io/badge/Framework-TensorFlow-orange)](https://www.tensorflow.org/)
  [![Accuracy](https://img.shields.io/badge/Accuracy-94.5%25-green)](https://github.com/memollizm)
</div>

## 📋 İçindekiler
- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Model Performansı](#-model-performansı)
- [Geliştirici](#-geliştirici)
- [Lisans](#-lisans)

## 🎯 Proje Hakkında

CellCheck AI, meme kanseri teşhisinde yapay zeka teknolojisini kullanarak doktorlara yardımcı olan yenilikçi bir web uygulamasıdır. U-Net mimarisi kullanılarak geliştirilen derin öğrenme modeli, ultrason görüntülerini analiz ederek kitleleri tespit eder ve segmentasyon yapar.

### 🌟 Temel Özellikler
- Ultrason görüntülerinin yapay zeka ile analizi
- Gerçek zamanlı kitle tespiti ve segmentasyonu
- Yüksek doğruluk oranı (%94.5)
- Kullanıcı dostu arayüz
- Detaylı kanser türü bilgilendirmesi

## 🚀 Özellikler

### 📊 Analiz Özellikleri
- **Görüntü Sınıflandırma**: Ultrason görüntülerini normal/anormal olarak sınıflandırma
- **Segmentasyon**: Kitlelerin otomatik tespiti ve sınırlandırılması
- **Doğruluk Göstergesi**: Model performansının gerçek zamanlı gösterimi

### 💡 Bilgi Sistemi
- Detaylı kanser türü açıklamaları
- Risk faktörleri analizi
- Erken teşhis önerileri
- İstatistiksel veriler

## 🛠️ Teknolojiler

### Backend
- Python 3.8+
- TensorFlow 2.x
- U-Net Model Mimarisi
- OpenCV

### Frontend
- HTML5 & CSS3
- JavaScript (ES6+)
- Font Awesome
- Google Fonts


## 💻 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/memollizm/CellCheck-AI.git
cd CellCheck-AI
```

2. Gerekli paketleri yükleyin:
```bash
pip install -r requirements.txt
```

3. Veritabanını oluşturun:
```bash
python init_db.py
```

4. Uygulamayı başlatın:
```bash
python app.py
```

## 📱 Kullanım

1. Ana sayfada "Görüntü Yükle" butonuna tıklayın
2. Ultrason görüntüsünü seçin veya sürükleyip bırakın
3. "Analiz Et" butonuna tıklayın
4. Sonuçları inceleyin:
   - Sınıflandırma sonucu
   - Segmentasyon görüntüsü
   - Model doğruluk oranı

## 📈 Model Performansı

| Metrik | Değer |
|--------|--------|
| Doğruluk | %94.5 |
| IoU Skoru | 0.89 |
| İşlem Süresi | 0.8s |
| Veri Seti Boyutu | 2,500+ |

### Model Mimarisi
- Encoder-Decoder yapısı
- 5 katmanlı U-Net
- Batch Normalization
- Dropout katmanları

## 👨‍💻 Geliştirici

**Mehmet Başgöze**
- LinkedIn: [Mehmet Başgöze](https://www.linkedin.com/in/mehmetbasgoze/)
- GitHub: [@memollizm](https://github.com/memollizm)

---

<div align="center">
  <sub>Built with ❤️ by Mehmet Başgöze</sub>
</div>
