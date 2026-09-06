const themeToggle = document.querySelector('#theme-toggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn--prev');
const nextBtn = document.querySelector('.carousel-btn--next');

nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
});

const menuToggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
});
