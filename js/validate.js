window.App = window.App || {};

App.Validate = (() => {
    const LIMITS = {
        id: 64,
        categoryName: 60,
        productName: 120,
        description: 2000,
        imageUrl: 2048,
    };

    function isHttpsUrl(value) {
        try {
            return new URL(value).protocol === 'https:';
        } catch {
            return false;
        }
    }

    function requiredText(value, label, max) {
        if (!value) return `${label} is required`;
        if (value.length > max) return `${label} must be ${max} characters or fewer`;
        return '';
    }

    function optionalText(value, label, max) {
        if (value.length > max) return `${label} must be ${max} characters or fewer`;
        return '';
    }

    function price(value) {
        if (!value) return 'Price is required';
        const amount = Number(value);
        if (!Number.isFinite(amount)) return 'Price must be a number';
        if (amount < 0) return 'Price cannot be negative';
        return '';
    }

    function imageUrl(value) {
        if (!value) return '';
        return isHttpsUrl(value) ? '' : 'Image URL must be a valid https:// address';
    }

    const product = {
        name: (value) => requiredText(value, 'Name', LIMITS.productName),
        price,
        image: (value) => optionalText(value, 'Image URL', LIMITS.imageUrl) || imageUrl(value),
        description: (value) => optionalText(value, 'Description', LIMITS.description),
    };

    const category = {
        name: (value) => requiredText(value, 'Category name', LIMITS.categoryName),
    };

    return { LIMITS, isHttpsUrl, product, category };
})();
