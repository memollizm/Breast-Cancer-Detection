// Beslenme kartlarının animasyonu
document.addEventListener('DOMContentLoaded', function () {
    // Filtreleme işlevselliği
    const filterButtons = document.querySelectorAll('.filter-btn');
    const nutritionContainer = document.querySelector('.nutrition-container');
    const nutritionCards = document.querySelectorAll('.nutrition-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif buton stilini güncelle
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Kartları filtrele
            nutritionCards.forEach(card => {
                if (filterValue === 'all') {
                    // Tüm kartları göster
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                } else {
                    // Sadece seçilen kategoriye ait kartları göster
                    if (card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('visible');
                    }
                }
            });

            // Seçilen kategoriye ait kartları en üste taşı
            if (filterValue !== 'all') {
                const matchingCards = Array.from(nutritionCards).filter(card =>
                    card.getAttribute('data-category') === filterValue
                );

                matchingCards.forEach(card => {
                    nutritionContainer.insertBefore(card, nutritionContainer.firstChild);
                });
            }
        });
    });

    // Besin kartları için hover efekti
    nutritionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Önemli notlar için animasyon
    const noteItems = document.querySelectorAll('.note-item');
    noteItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Tarif resimleri için zoom efekti
    const recipeImages = document.querySelectorAll('.recipe-image');
    recipeImages.forEach(image => {
        image.addEventListener('mouseenter', () => {
            image.style.transform = 'scale(1.1)';
        });
        image.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)';
        });
    });

    // Tarif butonları için hover efekti
    const recipeButtons = document.querySelectorAll('.recipe-btn');
    recipeButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-5px)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Beslenme ipuçları için tooltip efekti
    const nutritionTips = document.querySelectorAll('.nutrition-tip');
    nutritionTips.forEach(tip => {
        tip.addEventListener('mouseenter', () => {
            tip.style.backgroundColor = 'var(--primary-color)';
            tip.style.color = 'white';
        });
        tip.addEventListener('mouseleave', () => {
            tip.style.backgroundColor = '';
            tip.style.color = '';
        });
    });

    // Sayfa yüklendiğinde otomatik olarak en üste kaydır
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Tarif Pop-up İşlevselliği
    const recipePopup = document.getElementById('recipePopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupIngredients = document.getElementById('popupIngredients');
    const popupInstructions = document.getElementById('popupInstructions');
    const popupTips = document.getElementById('popupTips');
    const closePopup = document.querySelector('.close-popup');

    // Tarif verileri
    const recipes = {
        smoothie: {
            title: 'Antioksidan Smoothie',
            ingredients: [
                '1 su bardağı yaban mersini',
                '2 avuç ıspanak',
                '1 adet muz',
                '1 su bardağı badem sütü',
                '1 yemek kaşığı chia tohumu',
                '1 çay kaşığı bal'
            ],
            instructions: [
                'Tüm malzemeleri blender\'a koyun',
                'Pürüzsüz bir kıvam alana kadar karıştırın',
                'İsteğe bağlı olarak buz ekleyin',
                'Hemen servis yapın'
            ],
            tips: 'Smoothie\'yi hazırladıktan sonra hemen tüketin. Chia tohumları için 10 dakika bekleyebilirsiniz.'
        },
        kinoa: {
            title: 'Kinoa Salatası',
            ingredients: [
                '1 su bardağı kinoa',
                '1 adet avokado',
                '1 adet salatalık',
                '1 adet domates',
                '1/4 demet maydanoz',
                '2 yemek kaşığı zeytinyağı',
                '1 limon suyu',
                'Tuz ve karabiber'
            ],
            instructions: [
                'Kinoayi yıkayın ve süzün',
                '2 su bardağı su ile pişirin',
                'Sebzeleri küp kup doğrayın',
                'Tüm malzemeleri karıştırın',
                'Zeytinyağı ve limon suyu ile soslayın'
            ],
            tips: 'Kinoayi pişirdikten sonra soğumasını bekleyin. Salatayı hazırladıktan sonra 1 saat buzdolabında bekletebilirsiniz.'
        },
        soup: {
            title: 'Sebze Çorbası',
            ingredients: [
                '2 adet havuç',
                '2 adet patates',
                '1 adet soğan',
                '2 adet domates',
                '1 adet kabak',
                '2 yemek kaşığı zeytinyağı',
                '1 litre su',
                'Tuz ve karabiber',
                '1 çay kaşığı kuru nane'
            ],
            instructions: [
                'Sebzeleri yıkayın ve doğrayın',
                'Zeytinyağında soğanları kavurun',
                'Diğer sebzeleri ekleyin',
                'Su ekleyip pişirin',
                'Sebzeler yumuşayınca blender\'dan gecirin',
                'Üzerine nane serpin'
            ],
            tips: 'Çorbayı pişirdikten sonra 1 gün buzdolabında saklayabilirsiniz. Servis etmeden önce ısıtın.'
        }
    };

    // Tarif butonlarına tıklama olayı ekle
    document.querySelectorAll('.recipe-btn').forEach(button => {
        button.addEventListener('click', () => {
            const recipeType = button.getAttribute('data-recipe');
            const recipe = recipes[recipeType];

            // Pop-up içeriğini doldur
            popupTitle.textContent = recipe.title;

            // Malzemeleri listele
            popupIngredients.innerHTML = '';
            recipe.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.innerHTML = `✅ ${ingredient}`;
                popupIngredients.appendChild(li);
            });

            // Hazırlanışı listele
            popupInstructions.innerHTML = '';
            recipe.instructions.forEach(instruction => {
                const li = document.createElement('li');
                li.textContent = instruction;
                popupInstructions.appendChild(li);
            });

            // Önerileri ekle
            popupTips.textContent = recipe.tips;

            // Pop-up'ı göster
            recipePopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Pop-up'ı kapat
    closePopup.addEventListener('click', () => {
        recipePopup.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Pop-up dışına tıklandığında kapat
    recipePopup.addEventListener('click', (e) => {
        if (e.target === recipePopup) {
            recipePopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && recipePopup.classList.contains('active')) {
            recipePopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}); 