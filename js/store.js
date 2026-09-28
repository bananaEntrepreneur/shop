window.App = window.App || {};

App.escapeHtml = function (str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
};

App.Store = (() => {
    const STORAGE_KEY = 'shop_catalog';

    const defaultData = {
        categories: [
            {
                id: 'clothing',
                name: 'Clothing',
                products: [
                    { id: crypto.randomUUID(), name: 'Old Money Polo', price: 29, image: 'https://placehold.co/400x400', description: 'Old Money Polo, M size.' },
                ],
            },
            {
                id: 'home-tech',
                name: 'Home & Tech',
                products: [
                    { id: crypto.randomUUID(), name: 'Memento RAM', price: 67, image: 'https://placehold.co/400x400', description: 'Memento RAM module.' },
                    { id: crypto.randomUUID(), name: 'Clin Window Cleaner', price: 4, image: 'https://placehold.co/400x400', description: 'Clin Window Cleaner.' },
                    { id: crypto.randomUUID(), name: 'Axel Parrot Statue', price: 12, image: 'https://placehold.co/400x400', description: 'Axel Parrot Statue.' },
                ],
            },
        ],
    };

    function load(key = STORAGE_KEY) {
        const raw = localStorage.getItem(key);
        if (!raw) {
            const seeded = structuredClone(defaultData);
            save(seeded, key);
            return seeded;
        }
        return JSON.parse(raw);
    }

    function save(data, key = STORAGE_KEY) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function getCategories(key = STORAGE_KEY) {
        return load(key).categories;
    }

    function getCategory(id, key = STORAGE_KEY) {
        return getCategories(key).find((c) => c.id === id) || null;
    }

    function addCategory(name, key = STORAGE_KEY) {
        const data = load(key);
        const category = { id: crypto.randomUUID(), name, products: [] };
        data.categories.push(category);
        save(data, key);
        return category;
    }

    function updateCategory(id, name, key = STORAGE_KEY) {
        const data = load(key);
        const category = data.categories.find((c) => c.id === id);
        if (!category) return null;
        category.name = name;
        save(data, key);
        return category;
    }

    function deleteCategory(id, key = STORAGE_KEY) {
        const data = load(key);
        data.categories = data.categories.filter((c) => c.id !== id);
        save(data, key);
    }

    function getProduct(id, key = STORAGE_KEY) {
        for (const category of getCategories(key)) {
            const product = category.products.find((p) => p.id === id);
            if (product) return { ...product, categoryId: category.id, categoryName: category.name };
        }
        return null;
    }

    function addProduct(categoryId, productData, key = STORAGE_KEY) {
        const data = load(key);
        const category = data.categories.find((c) => c.id === categoryId);
        if (!category) return null;
        const product = { id: crypto.randomUUID(), ...productData };
        category.products.push(product);
        save(data, key);
        return product;
    }

    function updateProduct(id, productData, key = STORAGE_KEY) {
        const data = load(key);
        for (const category of data.categories) {
            const product = category.products.find((p) => p.id === id);
            if (product) {
                Object.assign(product, productData);
                save(data, key);
                return product;
            }
        }
        return null;
    }

    function deleteProduct(id, key = STORAGE_KEY) {
        const data = load(key);
        for (const category of data.categories) {
            category.products = category.products.filter((p) => p.id !== id);
        }
        save(data, key);
    }

    return {
        STORAGE_KEY,
        getCategories,
        getCategory,
        addCategory,
        updateCategory,
        deleteCategory,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
    };
})();
