window.App = window.App || {};
App.Views = App.Views || {};

App.Views.productForm = function (params) {
    const editing = Boolean(params.id);
    const product = editing ? App.Store.getProduct(params.id) : null;
    if (editing && !product) {
        App.Router.navigate('/catalog');
        return;
    }

    const esc = App.escapeHtml;
    const categories = App.Store.getCategories();
    if (categories.length === 0) {
        document.getElementById('app-page').innerHTML = `
            <a href="#/catalog">&larr; Cancel</a>
            <p>You need a category before adding a product.</p>
            <a class="btn" href="#/categories">Manage categories</a>
        `;
        return;
    }
    const selectedCategoryId = product ? product.categoryId : categories[0].id;

    document.getElementById('app-page').innerHTML = `
        <a href="#/catalog">&larr; Cancel</a>
        <h2>${editing ? 'Edit product' : 'Add product'}</h2>
        <form class="product-form" id="product-form">
            <label>Name
                <input type="text" name="name" required value="${esc(product ? product.name : '')}">
            </label>
            <label>Price ($)
                <input type="number" name="price" min="0" step="0.01" required value="${esc(product ? product.price : '')}">
            </label>
            <label>Image URL
                <input type="url" name="image" value="${esc(product ? product.image : '')}" placeholder="https://placehold.co/400x400">
            </label>
            <label>Description
                <textarea name="description">${esc(product ? product.description || '' : '')}</textarea>
            </label>
            <label>Category
                <select name="categoryId">
                    ${categories.map((c) => `<option value="${esc(c.id)}" ${c.id === selectedCategoryId ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
                </select>
            </label>
            <div class="product-form-actions">
                <button type="submit" class="btn">${editing ? 'Save' : 'Create'}</button>
                <a class="btn btn--secondary" href="#/catalog">Cancel</a>
            </div>
        </form>
    `;

    document.getElementById('product-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name').trim(),
            price: Number(formData.get('price')),
            image: formData.get('image').trim() || 'https://placehold.co/400x400',
            description: formData.get('description').trim(),
        };
        const categoryId = formData.get('categoryId');

        if (editing) {
            App.Store.updateProduct(product.id, data);
            App.Router.navigate(`/product/${product.id}`);
        } else {
            const created = App.Store.addProduct(categoryId, data);
            App.Router.navigate(`/product/${created.id}`);
        }
    });
};
