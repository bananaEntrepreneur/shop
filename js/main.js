const { Router, Views } = App;

const outlet = App.Layout.mount(document.getElementById('app'));

function landing(sectionId, title) {
    return () => Views.landing(sectionId, title);
}

Router.register('/', landing('top', ''));
Router.register('/faq', landing('faq', 'FAQ'));
Router.register('/about', landing('about', 'About'));
Router.register('/catalog', Views.catalog);
Router.register('/categories', Views.categories);
Router.register('/product/new', Views.productForm);
Router.register('/product/:id/edit', Views.productForm);
Router.register('/product/:id', Views.detail);
Router.register('*', Views.notFound);

Router.start(outlet);
