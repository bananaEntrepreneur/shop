window.App = window.App || {};

App.escapeHtml = function (str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
};

App.Store = (() => {
    const STORAGE_KEY = 'shop_catalog';
    const DEFAULT_IMAGE = 'https://placehold.co/400x400';

    const defaultData = {
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

    const LIMITS = {
        id: 64,
        categoryName: 60,
        productName: 120,
        description: 2000,
        imageUrl: 2048,
    };

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
        if (!url) return '';
        try {
            const { protocol } = new URL(url);
            return protocol === 'https:' ? url : '';
        } catch {
            return '';
        }
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

    function load(key = STORAGE_KEY) {
        const raw = localStorage.getItem(key);
        if (!raw) {
            const seeded = structuredClone(defaultData);
            save(seeded, key);
            return seeded;
        }
        try {
            return normalizeData(raw);
        } catch {
            const seeded = structuredClone(defaultData);
            save(seeded, key);
            return seeded;
        }
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
        const category = { id: crypto.randomUUID(), name: toText(name, LIMITS.categoryName), products: [] };
        data.categories.push(category);
        save(data, key);
        return category;
    }

    function updateCategory(id, name, key = STORAGE_KEY) {
        const data = load(key);
        const category = data.categories.find((c) => c.id === id);
        if (!category) return null;
        category.name = toText(name, LIMITS.categoryName);
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
        const product = normalizeProduct({ ...productData, id: crypto.randomUUID() });
        category.products.push(product);
        save(data, key);
        return product;
    }

    function updateProduct(id, productData, key = STORAGE_KEY) {
        const data = load(key);
        for (const category of data.categories) {
            const product = category.products.find((p) => p.id === id);
            if (product) {
                Object.assign(product, normalizeProduct({ ...product, ...productData, id: product.id }));
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
        DEFAULT_IMAGE,
        LIMITS,
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
