window.App = window.App || {};
App.Views = App.Views || {};

App.filterProducts = function (categories, query) {
    function parsePrice(value) {
        if (!value) return null;
        const price = Number(value);
        return Number.isFinite(price) && price >= 0 ? price : null;
    }

    const selected = query.getAll('category');
    const min = parsePrice(query.get('minPrice'));
    const max = parsePrice(query.get('maxPrice'));

    const products = [];
    for (const category of categories) {
        for (const product of category.products) {
            const inCategory = selected.length === 0 || selected.includes(category.id);
            const aboveMin = min === null || product.price >= min;
            const belowMax = max === null || product.price <= max;
            if (inCategory && aboveMin && belowMax) products.push(product);
        }
    }
    return { products, selected, min, max };
};

App.Views.catalog = function ({ query }) {
    const { html } = App;
    const { DEFAULT_IMAGE } = App.Store;
    const categories = App.Store.getCategories();
    const { products, selected, min, max } = App.filterProducts(categories, query);
    const hasFilters = selected.length > 0 || min !== null || max !== null;

    return {
        title: 'Catalog',
        html: html`
            <div class="app-page-inner catalog-page">
                <form class="catalog-sidebar" id="filters">
                    <div class="filter-group">
                        <h3>Category</h3>
                        ${categories.length ? categories.map((c) => html`
                            <label class="filter-checkbox">
                                <input type="checkbox" name="category" value="${c.id}" ${selected.includes(c.id) ? 'checked' : ''}>
                                ${c.name}
                            </label>
                        `) : html`<p class="filter-empty">No categories yet.</p>`}
                    </div>
                    <div class="filter-group">
                        <h3>Price</h3>
                        <div class="price-range">
                            <input type="number" name="minPrice" min="0" placeholder="Min" value="${min}">
                            <span>&ndash;</span>
                            <input type="number" name="maxPrice" min="0" placeholder="Max" value="${max}">
                        </div>
                    </div>
                    ${hasFilters ? html`<a href="#/catalog" class="filter-reset">Reset filters</a>` : ''}
                    <a href="#/categories" class="filter-manage-link">Manage categories</a>
                </form>
                <div class="catalog-main">
                    <div class="catalog-toolbar">
                        <h2>Catalog</h2>
                        <p class="catalog-count">${products.length} product${products.length === 1 ? '' : 's'}</p>
                        <a class="btn" href="#/product/new">+ Add product</a>
                    </div>
                    <div class="product-grid">
                        ${products.length ? products.map((product) => html`
                            <a class="product-card" href="#/product/${encodeURIComponent(product.id)}">
                                <img src="${product.image || DEFAULT_IMAGE}" alt="${product.name}">
                                <div class="product-info">
                                    <h3>${product.name}</h3>
                                    <p class="product-price">${product.price} $</p>
                                </div>
                            </a>
                        `) : html`<p class="catalog-empty">No products match your filters.</p>`}
                    </div>
                </div>
            </div>
        `,
        mount(root) {
            const form = root.querySelector('#filters');
            form.addEventListener('change', () => {
                const q = new URLSearchParams();
                for (const [name, value] of new FormData(form)) {
                    if (value !== '') q.append(name, value);
                }
                App.Router.navigate('/catalog', q);
            });
        },
    };
};
