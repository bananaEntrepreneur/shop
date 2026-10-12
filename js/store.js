window.App = window.App || {};

App.createStore = function (storage, key) {
    const { LIMITS, isHttpsUrl } = App.Validate;
    const DEFAULT_IMAGE = 'https://placehold.co/400x400';

    function seedData() {
        return {
            categories: [
                {
                    id: 'clothing',
                    name: 'Clothing',
                    products: [
                        { id: crypto.randomUUID(), name: 'Old Money Polo', price: 29, image: DEFAULT_IMAGE, description: 'Old Money Polo, M size.' },
                    ],
                },
                {
                    id: 'home',
                    name: 'Home',
                    products: [
                        { id: crypto.randomUUID(), name: 'Clin Window Cleaner', price: 4, image: DEFAULT_IMAGE, description: 'Clin Window Cleaner.' },
                        { id: crypto.randomUUID(), name: 'Axel Parrot Statue', price: 12, image: DEFAULT_IMAGE, description: 'Axel Parrot Statue.' },
                    ],
                },
                {
                    id: 'tech',
                    name: 'Tech',
                    products: [
                        { id: crypto.randomUUID(), name: 'Memento RAM', price: 67, image: DEFAULT_IMAGE, description: 'Memento RAM module.' },
                    ],
                },
            ],
        };
    }

    function asObject(value) {
        return value && typeof value === 'object' ? value : {};
    }

    function toText(value, maxLength) {
        return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
    }

    function toPrice(value) {
        const price = Number(value);
        return Number.isFinite(price) && price >= 0 ? price : 0;
    }

    function toImageUrl(value) {
        const url = toText(value, LIMITS.imageUrl);
        return isHttpsUrl(url) ? url : '';
    }

    function normalizeProduct(raw) {
        const product = asObject(raw);
        return {
            id: toText(product.id, LIMITS.id),
            name: toText(product.name, LIMITS.productName),
            price: toPrice(product.price),
            image: toImageUrl(product.image),
            description: toText(product.description, LIMITS.description),
        };
    }

    function normalizeCategory(raw) {
        const category = asObject(raw);
        return {
            id: toText(category.id, LIMITS.id),
            name: toText(category.name, LIMITS.categoryName),
            products: Array.isArray(category.products) ? category.products.map(normalizeProduct) : [],
        };
    }

    function normalizeData(raw) {
        const data = asObject(raw);
        return {
            categories: Array.isArray(data.categories) ? data.categories.map(normalizeCategory) : [],
        };
    }

    function readSaved() {
        try {
            const parsed = JSON.parse(storage.getItem(key));
            return parsed && typeof parsed === 'object' ? normalizeData(parsed) : null;
        } catch {
            return null;
        }
    }

    function save(data) {
        storage.setItem(key, JSON.stringify(data));
    }

    function load() {
        const saved = readSaved();
        if (saved) return saved;

        const seed = seedData();
        save(seed);
        return seed;
    }

    function getCategories() {
        return load().categories;
    }

    function getCategory(id) {
        return getCategories().find((c) => c.id === id) || null;
    }

    function addCategory(name) {
        const data = load();
        const category = { id: crypto.randomUUID(), name: toText(name, LIMITS.categoryName), products: [] };
        data.categories.push(category);
        save(data);
        return category;
    }

    function updateCategory(id, name) {
        const data = load();
        const category = data.categories.find((c) => c.id === id);
        if (!category) return null;

        category.name = toText(name, LIMITS.categoryName);
        save(data);
        return category;
    }

    function deleteCategory(id) {
        const data = load();
        data.categories = data.categories.filter((c) => c.id !== id);
        save(data);
    }

    function getProduct(id) {
        for (const category of getCategories()) {
            const product = category.products.find((p) => p.id === id);
            if (product) return { ...product, categoryId: category.id, categoryName: category.name };
        }
        return null;
    }

    function addProduct(categoryId, productData) {
        const data = load();
        const category = data.categories.find((c) => c.id === categoryId);
        if (!category) return null;

        const product = normalizeProduct({ ...productData, id: crypto.randomUUID() });
        category.products.push(product);
        save(data);
        return product;
    }

    function updateProduct(id, productData) {
        const data = load();
        for (const category of data.categories) {
            const index = category.products.findIndex((p) => p.id === id);
            if (index === -1) continue;

            const updated = normalizeProduct({ ...category.products[index], ...productData, id });
            const target = data.categories.find((c) => c.id === productData.categoryId) || category;
            if (target === category) {
                category.products[index] = updated;
            } else {
                category.products.splice(index, 1);
                target.products.push(updated);
            }
            save(data);
            return updated;
        }
        return null;
    }

    function deleteProduct(id) {
        const data = load();
        for (const category of data.categories) {
            category.products = category.products.filter((p) => p.id !== id);
        }
        save(data);
    }

    return {
        DEFAULT_IMAGE,
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
};

App.Store = App.createStore(localStorage, 'shop_catalog');
