window.App = window.App || {};

App.initCarousel = function (carousel) {
    const track = carousel.querySelector('.carousel-track');

    function scrollByOneSlide(direction) {
        track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' });
    }

    carousel.querySelector('.carousel-btn--prev').addEventListener('click', () => scrollByOneSlide(-1));
    carousel.querySelector('.carousel-btn--next').addEventListener('click', () => scrollByOneSlide(1));
};
