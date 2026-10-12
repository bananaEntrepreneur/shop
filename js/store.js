window.App = window.App || {};

App.createStore = function (storage, key) {
    const { LIMITS, isHttpsUrl } = App.Validate;
    const DEFAULT_IMAGE = 'https://placehold.co/400x400';

    const seedData = () => ({
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
    });

    function toText(value, max) {
        if (typeof value !== 'string' || !Number.isInteger(max) || max <= 0) return '';
        return value.trim().slice(0, max);
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
        const product = raw && typeof raw === 'object' ? raw : {};
        return {
            id: toText(product.id, LIMITS.id),
            name: toText(product.name, LIMITS.productName),
            price: toPrice(product.price),
            image: toImageUrl(product.image),
            description: toText(product.description, LIMITS.description),
        };
    }

    function normalizeCategory(raw) {
        const category = raw && typeof raw === 'object' ? raw : {};
        return {
            id: toText(category.id, LIMITS.id),
            name: toText(category.name, LIMITS.categoryName),
            products: Array.isArray(category.products) ? category.products.map(normalizeProduct) : [],
        };
    }

    function normalizeData(raw) {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') throw new TypeError('catalog is not an object');
        return {
            categories: Array.isArray(parsed.categories) ? parsed.categories.map(normalizeCategory) : [],
        };
    }

    let cache = null;
    globalThis.addEventListener?.('storage', (e) => { if (e.key === key) cache = null; });

    function save() {
        try {
            storage.setItem(key, JSON.stringify(cache));
        } catch (e) {
            cache = null;
            throw e;
        }
    }

    function load() {
        if (cache) return cache;
        try {
            cache = normalizeData(storage.getItem(key));
        } catch {
            cache = seedData();
            save();
        }
        return cache;
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
        save();
        return category;
    }

    function updateCategory(id, name) {
        const category = load().categories.find((c) => c.id === id);
        if (!category) return null;
        category.name = toText(name, LIMITS.categoryName);
        save();
        return category;
    }

    function deleteCategory(id) {
        const data = load();
        data.categories = data.categories.filter((c) => c.id !== id);
        save();
    }

    function getProduct(id) {
        for (const category of getCategories()) {
            const product = category.products.find((p) => p.id === id);
            if (product) return { ...product, categoryId: category.id, categoryName: category.name };
        }
        return null;
    }

    function addProduct(categoryId, productData) {
        const category = load().categories.find((c) => c.id === categoryId);
        if (!category) return null;
        const product = normalizeProduct({ ...productData, id: crypto.randomUUID() });
        category.products.push(product);
        save();
        return product;
    }

    function updateProduct(id, productData) {
        const { categories } = load();
        for (const category of categories) {
            const product = category.products.find((p) => p.id === id);
            if (!product) continue;
            Object.assign(product, normalizeProduct({ ...product, ...productData, id }));
            const target = categories.find((c) => c.id === productData.categoryId);
            if (target && target !== category) {
                category.products = category.products.filter((p) => p !== product);
                target.products.push(product);
            }
            save();
            return product;
        }
        return null;
    }

    function deleteProduct(id) {
        for (const category of load().categories) {
            category.products = category.products.filter((p) => p.id !== id);
        }
        save();
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
