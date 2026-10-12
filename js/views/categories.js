window.App = window.App || {};
App.Views = App.Views || {};

App.Views.categories = function () {
    const { html } = App;
    const { LIMITS } = App.Validate;
    const categories = App.Store.getCategories();

    return {
        title: 'Categories',
        html: html`
            <div class="app-page-inner narrow-page">
                <a href="#/catalog" class="back-link">&larr; Back to catalog</a>
                <h2>Manage categories</h2>
                <form id="add-category-form" class="category-form">
                    <input type="text" name="name" placeholder="New category name" maxlength="${LIMITS.categoryName}" required>
                    <button type="submit" class="btn">Add</button>
                </form>
                ${categories.length ? html`
                    <ul class="category-list">
                        ${categories.map((c) => html`
                            <li class="category-row" data-id="${c.id}">
                                <form class="category-rename-form">
                                    <input type="text" name="name" value="${c.name}" maxlength="${LIMITS.categoryName}" required>
                                    <button type="submit" class="btn btn--secondary">Save</button>
                                </form>
                                <span class="category-count">${c.products.length} product${c.products.length === 1 ? '' : 's'}</span>
                                <button type="button" class="btn btn--danger category-delete">Delete</button>
                            </li>
                        `)}
                    </ul>
                ` : html`<p>No categories yet.</p>`}
            </div>
        `,
        mount(root) {
            function bindValidation(form, onValid) {
                const input = form.elements.name;
                input.addEventListener('input', () => input.setCustomValidity(''));
                form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const name = input.value.trim();
                    const message = App.Validate.category.name(name);
                    input.setCustomValidity(message);
                    if (message) {
                        input.reportValidity();
                        return;
                    }
                    onValid(name);
                });
            }

            bindValidation(root.querySelector('#add-category-form'), (name) => {
                App.Store.addCategory(name);
                App.Router.refresh();
            });

            root.querySelectorAll('.category-row').forEach((row) => {
                const id = row.dataset.id;

                bindValidation(row.querySelector('.category-rename-form'), (name) => {
                    App.Store.updateCategory(id, name);
                    App.Router.refresh();
                });

                row.querySelector('.category-delete').addEventListener('click', () => {
                    const category = App.Store.getCategory(id);
                    const message = category.products.length
                        ? `Delete "${category.name}" and its ${category.products.length} product(s)?`
                        : `Delete "${category.name}"?`;
                    if (confirm(message)) {
                        App.Store.deleteCategory(id);
                        App.Router.refresh();
                    }
                });
            });
        },
    };
};
