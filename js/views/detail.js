window.App = window.App || {};
App.Views = App.Views || {};

App.Views.detail = function ({ params }) {
    const product = App.Store.getProduct(params.id);
    if (!product) return { redirect: '/catalog' };

    const { html } = App;
    const { DEFAULT_IMAGE } = App.Store;

    return {
        title: product.name,
        html: html`
            <div class="app-page-inner">
                <a href="#/catalog" class="back-link">&larr; Back to catalog</a>
                <article class="product-detail">
                    <img src="${product.image || DEFAULT_IMAGE}" alt="${product.name}">
                    <div class="product-detail-info">
                        <p class="product-detail-category">${product.categoryName}</p>
                        <h2>${product.name}</h2>
                        <p class="product-price">${product.price} $</p>
                        <p class="product-detail-description">${product.description}</p>
                        <div class="product-detail-actions">
                            <a class="btn" href="#/product/${encodeURIComponent(product.id)}/edit">Edit</a>
                            <button type="button" class="btn btn--danger" id="delete-product">Delete</button>
                        </div>
                    </div>
                </article>
            </div>
        `,
        mount(root) {
            root.querySelector('#delete-product').addEventListener('click', () => {
                if (confirm(`Delete "${product.name}"?`)) {
                    App.Store.deleteProduct(product.id);
                    App.Router.navigate('/catalog');
                }
            });
        },
    };
};
