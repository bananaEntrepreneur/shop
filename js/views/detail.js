window.App = window.App || {};
App.Views = App.Views || {};

App.Views.detail = function (params) {
    const product = App.Store.getProduct(params.id);
    if (!product) {
        App.Router.navigate('/catalog');
        return;
    }

    const esc = App.escapeHtml;

    document.getElementById('app-page').innerHTML = `
        <div class="app-page-inner">
            <a href="#/catalog" class="back-link">&larr; Back to catalog</a>
            <article class="product-detail">
                <img src="${esc(product.image)}" alt="${esc(product.name)}">
                <div class="product-detail-info">
                    <p class="product-detail-category">${esc(product.categoryName)}</p>
                    <h2>${esc(product.name)}</h2>
                    <p class="product-price">${product.price} $</p>
                    <p class="product-detail-description">${esc(product.description || '')}</p>
                    <div class="product-detail-actions">
                        <a class="btn" href="#/product/${product.id}/edit">Edit</a>
                        <button type="button" class="btn btn--danger" id="delete-product">Delete</button>
                    </div>
                </div>
            </article>
        </div>
    `;

    document.getElementById('delete-product').addEventListener('click', () => {
        if (confirm(`Delete "${product.name}"?`)) {
            App.Store.deleteProduct(product.id);
            App.Router.navigate('/catalog');
        }
    });
};
