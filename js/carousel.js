window.App = window.App || {};

App.initCarousel = function (carousel) {
    const track = carousel.querySelector('.carousel-track');

    function scrollBySlides(direction) {
        const [first, second] = track.children;
        const slideStep = second.offsetLeft - first.offsetLeft;
        track.scrollBy({ left: direction * slideStep, behavior: 'smooth' });
    }

    carousel.querySelector('.carousel-btn--prev').addEventListener('click', () => scrollBySlides(-1));
    carousel.querySelector('.carousel-btn--next').addEventListener('click', () => scrollBySlides(1));
};
