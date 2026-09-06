const prevBtn = document.querySelector('.carousel-btn--prev');
const nextBtn = document.querySelector('.carousel-btn--next');
const slides = document.querySelectorAll('.carousel-slide');

let currentIndex = 0;

function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    slides[currentIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
    });
}

nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
});

prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
});
