// Modal işlemleri
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');

// Zoom butonlarına tıklama olayı ekle
document.querySelectorAll('.zoom-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const img = this.closest('.card-image').querySelector('img');
        modal.style.display = 'block';
        modalImg.src = img.src;
    });
});

// Modal kapatma
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Modal dışına tıklayınca kapatma
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Filtreleme işlemleri
const filterButtons = document.querySelectorAll('.filter-btn');
const outputCards = document.querySelectorAll('.output-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Aktif buton stilini güncelle
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        // Kartları filtrele
        outputCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                // Animasyon efekti
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Animasyon için CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Sayfa yüklendiğinde animasyon
document.addEventListener('DOMContentLoaded', () => {
    outputCards.forEach((card, index) => {
        card.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.1}s`;
    });
});

// Scroll animasyonu
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Tüm kartları gözlemle
document.querySelectorAll('.output-card, .metric-card, .info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-in-out';
    observer.observe(card);
}); 