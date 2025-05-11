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
document.querySelectorAll('.flip-card, .risk-card, .detection-card, .stat-box').forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// Flip kart animasyonları için ek kod
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelector('.flip-card-inner').style.transform = 'rotateY(180deg)';
    });

    card.addEventListener('mouseleave', () => {
        card.querySelector('.flip-card-inner').style.transform = 'rotateY(0deg)';
    });
});


document.head.appendChild(style);