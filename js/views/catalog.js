window.App = window.App || {};
App.Views = App.Views || {};

App.Views.catalog = function (query) {
    const { DEFAULT_IMAGE } = App.Store;

    function toPriceFilter(value) {
        const price = Number(value);
        return value && Number.isFinite(price) && price >= 0 ? String(price) : '';
    }

    const categories = App.Store.getCategories();
    const selectedCategories = query.getAll('category');
    const minPrice = toPriceFilter(query.get('minPrice'));
    const maxPrice = toPriceFilter(query.get('maxPrice'));

    let products = [];
    categories.forEach((category) => {
        category.products.forEach((product) => {
            products.push({ ...product, categoryId: category.id, categoryName: category.name });
        });
    });

    if (selectedCategories.length) {
        products = products.filter((p) => selectedCategories.includes(p.categoryId));
    }
    if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));

    const hasFilters = selectedCategories.length > 0 || minPrice || maxPrice;
    const esc = App.escapeHtml;

    document.getElementById('app-page').innerHTML = `
        <div class="app-page-inner catalog-page">
            <aside class="catalog-sidebar">
                <div class="filter-group">
                    <h3>Category</h3>
                    ${categories.map((c) => `
                        <label class="filter-checkbox">
                            <input type="checkbox" data-category="${esc(c.id)}" ${selectedCategories.includes(c.id) ? 'checked' : ''}>
                            ${esc(c.name)}
                        </label>
                    `).join('') || '<p class="filter-empty">No categories yet.</p>'}
                </div>
                <div class="filter-group">
                    <h3>Price</h3>
                    <div class="price-range">
                        <input type="number" id="filter-min-price" min="0" placeholder="Min" value="${esc(minPrice)}">
                        <span>&ndash;</span>
                        <input type="number" id="filter-max-price" min="0" placeholder="Max" value="${esc(maxPrice)}">
                    </div>
                </div>
                ${hasFilters ? '<a href="#/catalog" class="filter-reset">Reset filters</a>' : ''}
                <a href="#/categories" class="filter-manage-link">Manage categories</a>
            </aside>
            <div class="catalog-main">
                <div class="catalog-toolbar">
                    <h2>Catalog</h2>
                    <p class="catalog-count">${products.length} product${products.length === 1 ? '' : 's'}</p>
                    <a class="btn" href="#/product/new">+ Add product</a>
                </div>
                <div class="product-grid">
                    ${products.map((product) => `
                        <a class="product-card" href="#/product/${encodeURIComponent(product.id)}">
                            <img src="${esc(product.image || DEFAULT_IMAGE)}" alt="${esc(product.name)}">
                            <div class="product-info">
                                <h3>${esc(product.name)}</h3>
                                <p class="product-price">${esc(product.price)} $</p>
                            </div>
                        </a>
                    `).join('') || '<p class="catalog-empty">No products match your filters.</p>'}
                </div>
            </div>
        </div>
    `;

    function currentQuery() {
        const q = new URLSearchParams();
        selectedCategories.forEach((id) => q.append('category', id));
        if (minPrice) q.set('minPrice', minPrice);
        if (maxPrice) q.set('maxPrice', maxPrice);
        return q;
    }

    document.querySelectorAll('.filter-checkbox input[data-category]').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const id = checkbox.dataset.category;
            const q = currentQuery();
            const current = q.getAll('category');
            q.delete('category');
            (checkbox.checked ? [...current, id] : current.filter((c) => c !== id)).forEach((c) => q.append('category', c));
            App.Router.navigate('/catalog', q);
        });
    });

    function applyPriceFilter() {
        const q = currentQuery();
        const min = document.getElementById('filter-min-price').value;
        const max = document.getElementById('filter-max-price').value;
        min ? q.set('minPrice', min) : q.delete('minPrice');
        max ? q.set('maxPrice', max) : q.delete('maxPrice');
        App.Router.navigate('/catalog', q);
    }

    document.getElementById('filter-min-price').addEventListener('change', applyPriceFilter);
    document.getElementById('filter-max-price').addEventListener('change', applyPriceFilter);
};
