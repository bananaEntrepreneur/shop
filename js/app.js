document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const appPage = document.getElementById('app-page');
    const { Router, Views } = App;

    const page = (view) => (ctx) => {
        landingPage.hidden = true;
        appPage.hidden = false;
        return view(ctx);
    };

    Router.register('/', () => {
        landingPage.hidden = false;
        appPage.hidden = true;
        return { html: '' };
    });
    Router.register('/product/new', page(Views.productForm));
    Router.register('/product/:id/edit', page(Views.productForm));
    Router.register('/product/:id', page(Views.detail));
    Router.register('/categories', page(Views.categories));
    Router.register('/catalog', page(Views.catalog));

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]:not([href^="#/"])');
        if (!link) return;
        const id = link.getAttribute('href').slice(1);
        if (!id || !landingPage.hidden) return;

        event.preventDefault();
        Router.navigate('/');
        requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView();
        });
    });

    Router.start(appPage);
});
