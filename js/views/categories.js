window.App = window.App || {};
App.Views = App.Views || {};

App.Views.categories = function () {
    const esc = App.escapeHtml;

    function render() {
        const categories = App.Store.getCategories();

        document.getElementById('app-page').innerHTML = `
            <a href="#/catalog">&larr; Back to catalog</a>
            <h2>Manage categories</h2>
            <form id="add-category-form" class="category-form">
                <input type="text" name="name" placeholder="New category name" required>
                <button type="submit" class="btn">Add</button>
            </form>
            <ul class="category-list">
                ${categories.map((c) => `
                    <li class="category-row" data-id="${esc(c.id)}">
                        <form class="category-rename-form">
                            <input type="text" name="name" value="${esc(c.name)}" required>
                            <button type="submit" class="btn btn--secondary">Save</button>
                        </form>
                        <span class="category-count">${c.products.length} product${c.products.length === 1 ? '' : 's'}</span>
                        <button type="button" class="btn btn--danger category-delete">Delete</button>
                    </li>
                `).join('') || '<p>No categories yet.</p>'}
            </ul>
        `;

        document.getElementById('add-category-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const name = new FormData(event.target).get('name').trim();
            if (!name) return;
            App.Store.addCategory(name);
            render();
        });

        document.querySelectorAll('.category-row').forEach((row) => {
            const id = row.dataset.id;

            row.querySelector('.category-rename-form').addEventListener('submit', (event) => {
                event.preventDefault();
                const name = new FormData(event.target).get('name').trim();
                if (!name) return;
                App.Store.updateCategory(id, name);
                render();
            });

            row.querySelector('.category-delete').addEventListener('click', () => {
                const category = App.Store.getCategory(id);
                const message = category.products.length
                    ? `Delete "${category.name}" and its ${category.products.length} product(s)?`
                    : `Delete "${category.name}"?`;
                if (confirm(message)) {
                    App.Store.deleteCategory(id);
                    render();
                }
            });
        });
    }

    render();
};
