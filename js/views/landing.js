window.App = window.App || {};
App.Views = App.Views || {};

App.Views.landing = (() => {
    const { html, icons } = App;

    const SLIDES = ['10% discount on first order', 'New arrivals', 'Free shipping from 10$'];

    const FAQ = [
        { question: 'How do I place an order?', answer: 'Add a product to your cart, proceed to checkout, and enter your delivery address and payment method.' },
        { question: 'How long does delivery take?', answer: 'Delivery usually takes 4 to 10 business days, depending on your region.' },
        { question: 'Can I return a product?', answer: 'Yes, returns are accepted within 14 days of receiving your order, as long as the item is unused.' },
        { question: 'What payment methods are available?', answer: 'You can pay online by card, or in cash/by card upon delivery.' },
    ];

    const FEATURES = [
        { title: 'Quality', text: 'Every product is checked before it reaches you.' },
        { title: 'Fast delivery', text: 'Orders ship within 24 hours.' },
        { title: 'Secure payment', text: 'Your data and payments are always protected.' },
    ];

    return function (sectionId, title) {
        return {
            title,
            html: html`
                <section class="hero" id="top">
                    <h1>Find what you need</h1>
                    <p>High-quality products with delivery across country</p>
                    <a href="#/catalog" class="btn">Browse Catalog</a>
                </section>

                <section class="carousel" id="promo">
                    <h2>Special offers</h2>
                    <div class="carousel-wrapper">
                        <button class="carousel-btn carousel-btn--prev" aria-label="Previous slide">${icons.arrowLeft}</button>
                        <ul class="carousel-track">
                            ${SLIDES.map((text) => html`
                                <li class="carousel-slide">
                                    <img src="https://placehold.co/600x300" alt="${text}">
                                    <p>${text}</p>
                                </li>
                            `)}
                        </ul>
                        <button class="carousel-btn carousel-btn--next" aria-label="Next slide">${icons.arrowRight}</button>
                    </div>
                </section>

                <section class="faq" id="faq">
                    <h2>Frequently Asked Questions</h2>
                    <div class="faq-list">
                        ${FAQ.map((item) => html`
                            <details class="faq-item">
                                <summary>${item.question}</summary>
                                <p>${item.answer}</p>
                            </details>
                        `)}
                    </div>
                </section>

                <section class="about" id="about">
                    <h2>About Shop</h2>
                    <p class="about-text">Shop is a curated store for people who care about quality and simplicity. We pick every product ourselves and ship it fast, wherever you are.</p>
                    <div class="about-features">
                        ${FEATURES.map((feature) => html`
                            <div class="about-feature">
                                <h3>${feature.title}</h3>
                                <p>${feature.text}</p>
                            </div>
                        `)}
                    </div>
                </section>
            `,
            mount(root) {
                App.initCarousel(root.querySelector('.carousel'));
                if (sectionId !== 'top') root.querySelector('#' + sectionId).scrollIntoView();
            },
        };
    };
})();
