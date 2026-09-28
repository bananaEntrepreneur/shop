document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const appPage = document.getElementById('app-page');

    function showLanding() {
        landingPage.hidden = false;
        appPage.hidden = true;
    }

    function showApp(renderFn) {
        landingPage.hidden = true;
        appPage.hidden = false;
        renderFn();
    }

    App.Router.register('/', () => showLanding());
    App.Router.register('/product/new', () => showApp(() => App.Views.productForm({})));
    App.Router.register('/product/:id/edit', (params) => showApp(() => App.Views.productForm(params)));
    App.Router.register('/product/:id', (params) => showApp(() => App.Views.detail(params)));
    App.Router.register('/categories', () => showApp(() => App.Views.categories()));
    App.Router.register('/catalog', (params, query) => showApp(() => App.Views.catalog(query)));

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]:not([href^="#/"])');
        if (!link) return;
        const id = link.getAttribute('href').slice(1);
        if (!id || !landingPage.hidden) return;

        event.preventDefault();
        App.Router.navigate('/');
        requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView();
        });
    });

    App.Router.start();
});
