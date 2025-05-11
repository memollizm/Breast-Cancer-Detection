// Modal işlemleri
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');

// Tüm görüntü kartlarına zoom butonu ekle
document.querySelectorAll('.card-image').forEach(card => {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = '<button class="zoom-btn"><i class="fas fa-search-plus"></i></button>';
    card.appendChild(overlay);

    // Zoom butonuna tıklama olayı ekle
    overlay.querySelector('.zoom-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const img = card.querySelector('img');
        modal.style.display = 'flex';
        modalImg.src = img.src;
    });
});

// Modal kapatma işlemleri
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Scroll animasyonları
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animasyon eklenecek elementler
document.querySelectorAll('.flip-card, .result-box, .upload-area, .accuracy-box').forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// CSS Animasyonları
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    .fade-in.animate {
        opacity: 1;
        transform: translateY(0);
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .card-image:hover .overlay {
        opacity: 1;
    }

    .zoom-btn {
        background: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .zoom-btn:hover {
        transform: scale(1.1);
    }

    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        max-width: 90%;
        max-height: 90vh;
        object-fit: contain;
    }

    .close-modal {
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 30px;
        cursor: pointer;
    }
`;
document.head.appendChild(style); 