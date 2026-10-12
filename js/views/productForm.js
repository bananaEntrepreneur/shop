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
    const { LIMITS, DEFAULT_IMAGE } = App.Store;
    const categories = App.Store.getCategories();
    if (categories.length === 0) {
        document.getElementById('app-page').innerHTML = `
            <div class="app-page-inner narrow-page">
                <a href="#/catalog" class="back-link">&larr; Cancel</a>
                <p>You need a category before adding a product.</p>
                <a class="btn" href="#/categories">Manage categories</a>
            </div>
        `;
        return;
    }
    const selectedCategoryId = product ? product.categoryId : categories[0].id;

    document.getElementById('app-page').innerHTML = `
        <div class="app-page-inner narrow-page">
            <a href="#/catalog" class="back-link">&larr; Cancel</a>
            <h2>${editing ? 'Edit product' : 'Add product'}</h2>
            <form class="product-form" id="product-form">
                <label>Name
                    <input type="text" name="name" required maxlength="${LIMITS.productName}" value="${esc(product ? product.name : '')}">
                </label>
                <label>Price ($)
                    <input type="number" name="price" min="0" step="0.01" required value="${esc(product ? product.price : '')}">
                </label>
                <label>Image URL
                    <input type="url" name="image" maxlength="${LIMITS.imageUrl}" value="${esc(product ? product.image : '')}" placeholder="${DEFAULT_IMAGE}">
                </label>
                <label>Description
                    <textarea name="description" maxlength="${LIMITS.description}">${esc(product ? product.description || '' : '')}</textarea>
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
        </div>
    `;

    const form = document.getElementById('product-form');
    const fields = {
        name: form.elements.name,
        price: form.elements.price,
        image: form.elements.image,
        description: form.elements.description,
    };

    Object.values(fields).forEach((field) => {
        field.addEventListener('input', () => field.setCustomValidity(''));
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let firstInvalid = null;
        for (const [name, field] of Object.entries(fields)) {
            const message = App.Validate.product[name](field.value.trim());
            field.setCustomValidity(message);
            if (message && !firstInvalid) firstInvalid = field;
        }
        if (firstInvalid) {
            firstInvalid.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = {
            name: formData.get('name').trim(),
            price: Number(formData.get('price')),
            image: formData.get('image').trim() || DEFAULT_IMAGE,
            description: formData.get('description').trim(),
        };
        const categoryId = formData.get('categoryId');

        if (editing) {
            App.Store.updateProduct(product.id, data);
            App.Router.navigate(`/product/${encodeURIComponent(product.id)}`);
        } else {
            const created = App.Store.addProduct(categoryId, data);
            if (!created) return;
            App.Router.navigate(`/product/${encodeURIComponent(created.id)}`);
        }
    });
};
